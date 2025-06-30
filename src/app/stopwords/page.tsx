"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrashIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { mockStopwords } from "../../lib/mockData";
import { Stopword } from "../../types/types";
import { toast } from "sonner";

const fetchStopwords = async (): Promise<Stopword[]> => {
  return mockStopwords;
};

const addStopword = async (value: string): Promise<Stopword> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const newStopword = { id: Date.now().toString(), value };
      console.log(`Added stopword: ${value}`);
      resolve(newStopword);
    }, 500);
  });
};

const deleteStopword = async (id: string): Promise<void> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Deleted stopword: ${id}`);
      resolve();
    }, 500);
  });
};

const StopwordsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [newWord, setNewWord] = useState("");
  const {
    data: stopwords,
    isLoading,
    error,
  } = useQuery<Stopword[], Error>({
    queryKey: ["stopwords"],
    queryFn: fetchStopwords,
  });

  const addMutation = useMutation<Stopword, Error, string>({
    mutationFn: addStopword,
    onSuccess: (data) => {
      queryClient.setQueryData<Stopword[]>(["stopwords"], (old) => [
        ...(old || []),
        data,
      ]);
      setNewWord("");
      toast.success("Stopword added successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to add stopword: ${error.message}`);
    },
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: deleteStopword,
    onSuccess: (_, id) => {
      queryClient.setQueryData<Stopword[]>(
        ["stopwords"],
        (old) => old?.filter((word) => word.id !== id) || []
      );
      toast.success("Stopword removed successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to remove stopword: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWord.trim()) {
      addMutation.mutate(newWord.trim());
    }
  };

  if (isLoading)
    return <div className="text-center py-8">Loading stopwords...</div>;
  if (error)
    return (
      <div className="text-red-500 text-center py-8">
        Error: {error.message}
      </div>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Stopwords Management</h1>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
          placeholder="Enter a stopword"
          disabled={addMutation.isPending}
        />
        <Button
          type="submit"
          disabled={!newWord.trim() || addMutation.isPending}
        >
          {addMutation.isPending ? "Adding..." : "Add Stopword"}
        </Button>
      </form>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Stopword</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stopwords?.map((word) => (
              <TableRow key={word.id}>
                <TableCell className="font-medium">{word.value}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteMutation.mutate(word.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-gray-500">
        <p>
          Stopwords are common words that are excluded from search queries to
          improve performance.
        </p>
      </div>
    </div>
  );
};

export default StopwordsPage;
