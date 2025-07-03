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
import { Index } from "../../types/types";
import HealthBadge from "../../components/HealthBadge";
import { toast } from "sonner";
import { Header } from "@/components/Header";

const fetchIndexes = async (): Promise<Index[]> => {
  if (typeof window !== "undefined") {
    const cached = sessionStorage.getItem("elasticsearch_indexes");
    if (cached) {
      return JSON.parse(cached);
    }
  }
  const res = await fetch("/api/indexes");
  if (!res.ok) throw new Error("Failed to fetch indexes");

  const data = await res.json();

  if (typeof window !== "undefined") {
    sessionStorage.setItem("elasticsearch_indexes", JSON.stringify(data));
  }
  return data;
};

const swapIndex = async (newIndex: string): Promise<void> => {
  const res = await fetch("/api/indexes/swap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newIndex }),
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || "Swap failed");
  }
};

const deleteIndex = async (indexName: string): Promise<void> => {
  const res = await fetch("/api/indexes/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ index: indexName }),
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || "Delete failed");
  }
};

const runFullReindex = async (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Running full reindex");
      resolve();
    }, 1500);
  });
};

const IndexManagement = () => {
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
    onSuccess: () => {
      queryClient.invalidateQueries(["indexes"]);
      sessionStorage.removeItem("elasticsearch_indexes");
      window.location.reload();
      toast.success("Index swapped successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to swap index: ${error.message}`);
    },
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: deleteIndex,
    onSuccess: () => {
      sessionStorage.removeItem("elasticsearch_indexes");
      toast.success("Index deleted successfully!");
      window.location.reload();
    },
    onError: (error) => {
      toast.error(`Failed to delete index: ${error.message}`);
    },
  });

  const reindexMutation = useMutation<void, Error>({
    mutationFn: runFullReindex,
    onSuccess: () => {
      toast.success("Full reindex started successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to start reindex: ${error.message}`);
    },
  });

  if (isLoading)
    return <div className="text-center py-8">Loading indexes...</div>;
  if (error)
    return (
      <div className="text-red-500 text-center py-8">
        Error: {error.message}
      </div>
    );

  const activeIndex = indexes?.find((index) => index.alias === "products");
  const oldIndexes = indexes?.filter((index) => !index.alias) || [];

  return (
    <div className="space-y-6">
      <Header title="Index Management" />

      {activeIndex && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-semibold">Active Index</h2>
              <p className="text-lg">{activeIndex.index}</p>
              <div className="flex items-center mt-1">
                <span className="mr-2">Health:</span>
                <HealthBadge status={activeIndex.health} />
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{activeIndex["docs.count"]}</p>
              <p className="text-sm">documents</p>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">Old Indexes</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Index Name</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>Health</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {oldIndexes.map((index) => (
              <TableRow key={index.index}>
                <TableCell className="font-medium">{index.index}</TableCell>
                <TableCell>{index["docs.count"]}</TableCell>
                <TableCell>
                  <HealthBadge status={index.health} />
                </TableCell>
                <TableCell>
                  {new Date(
                    index?.lastModified || Date.now()
                  ).toLocaleDateString()}
                </TableCell>
                <TableCell className="space-x-2">
                  <Button
                    size="sm"
                    onClick={() => swapMutation.mutate(index.index)}
                    disabled={swapMutation.isPending}
                  >
                    {swapMutation.isPending ? "Swapping..." : "Make Active"}
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(index.index)}
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? "Deleting..." : "Delete"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
        <Button
          className="w-full sm:w-auto"
          onClick={() => reindexMutation.mutate()}
          disabled={reindexMutation.isPending}
        >
          {reindexMutation.isPending ? "Processing..." : "Run Full Reindex"}
        </Button>
        <Button variant="secondary" className="w-full sm:w-auto">
          Check for Updates Now
        </Button>
      </div>
    </div>
  );
};

export default IndexManagement;
