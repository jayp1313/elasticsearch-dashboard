"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { mockIndexes } from "../../lib/mockData";
import { Index } from "../../types/types";

const fetchIndexes = async (): Promise<Index[]> => {
  return mockIndexes.filter((idx) => idx.indexName.startsWith("product")); // Replace with API call later
};

const swapIndex = async (newIndexName: string): Promise<void> => {
  console.log(`Swapping alias to ${newIndexName}`); // Simulate API call
};

const deleteIndex = async (indexName: string): Promise<void> => {
  console.log(`Deleting index ${indexName}`); // Simulate API call
};

const IndexManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const {
    data: indexes,
    isLoading,
    error,
  } = useQuery<Index[], Error>({
    queryKey: ["indexes"],
    queryFn: fetchIndexes,
  });

  const swapMutation = useMutation<void, Error, string>({
    mutationFn: swapIndex,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["indexes"] }),
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: deleteIndex,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["indexes"] }),
  });

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  const oldIndexes = indexes?.filter((idx) => !idx.alias) || [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Index Management</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Index Name</TableHead>
            <TableHead>Documents</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {oldIndexes.map((index) => (
            <TableRow key={index.indexName}>
              <TableCell>{index.indexName}</TableCell>
              <TableCell>{index.documentCount}</TableCell>
              <TableCell>
                <Button
                  className="mr-2"
                  onClick={() => swapMutation.mutate(index.indexName)}
                >
                  Swap
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteMutation.mutate(index.indexName)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4">
        <Button className="mr-2">Run Full Reindex</Button>
        <Button>Check for Updates Now</Button>
      </div>
    </div>
  );
};

export default IndexManagement;
