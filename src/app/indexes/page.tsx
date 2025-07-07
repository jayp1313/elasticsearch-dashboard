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
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loader from "../utility/Loader";
import { Loader2, RefreshCw, RotateCw } from "lucide-react";

const fetchIndexes = async (): Promise<Index[]> => {
  const cacheKey = "indexesData";

  const cachedData = sessionStorage.getItem(cacheKey);
  if (cachedData) {
    try {
      return JSON.parse(cachedData);
    } catch (error) {
      console.warn("Failed to parse cached indexes:", error);
    }
  }

  const res = await fetch("/api/indexes");
  if (!res.ok) throw new Error("Failed to fetch indexes");

  const data: Index[] = await res.json();
  sessionStorage.setItem(cacheKey, JSON.stringify(data));
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
  const res = await fetch("/api/tasks/reindex", {
    method: "POST",
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to start full reindex");
  }

  const data = await res.json();
  console.log("Reindex started:", data);
};

const IndexManagement = () => {
  const queryClient = useQueryClient();

  const [refetchInterval, setRefetchInterval] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("refetch_interval");
      return saved ? parseInt(saved) : 60;
    }
    return 60;
  });

  const {
    data: indexes,
    isLoading,
    error,
    refetch,
  } = useQuery<Index[], Error>({
    queryKey: ["indexes"],
    queryFn: fetchIndexes,
  });

  useEffect(() => {
    if (refetchInterval < 5) return;
    const timer = setInterval(() => {
      sessionStorage.removeItem("indexesData");
      refetch();
    }, refetchInterval * 1000);

    return () => clearInterval(timer);
  }, [refetchInterval, refetch]);

  useEffect(() => {
    sessionStorage.setItem("refetch_interval", refetchInterval.toString());
  }, [refetchInterval]);

  const swapMutation = useMutation<void, Error, string>({
    mutationFn: swapIndex,
    onSuccess: () => {
      sessionStorage.removeItem("indexesData");
      queryClient.invalidateQueries({ queryKey: ["indexes"] });
      toast.success("Index swapped successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to swap index: ${error.message}`);
    },
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: deleteIndex,
    onSuccess: () => {
      sessionStorage.removeItem("indexesData");
      queryClient.invalidateQueries({ queryKey: ["indexes"] });
      toast.success("Index deleted successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to delete index: ${error.message}`);
    },
  });

  const reindexMutation = useMutation<void, Error>({
    mutationFn: runFullReindex,
    onSuccess: () => {
      sessionStorage.removeItem("indexesData");
      queryClient.invalidateQueries({ queryKey: ["indexes"] });
      toast.success("Full reindex started successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to start reindex: ${error.message}`);
    },
  });

  if (isLoading) return <Loader />;
  if (error)
    return (
      <div className="text-red-500 text-center py-8">
        Error: {error.message}
      </div>
    );

  const activeIndex = indexes?.find((index) => index.alias === "products");
  const oldIndexes = indexes?.filter((index) => !index.alias) || [];

  return (
    <div className="space-y-8">
      <Header title="Index Management" />

      {activeIndex && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-2">
              <h2 className="text-sm font-medium text-muted-foreground">
                Active Index
              </h2>
              <p className="text-2xl font-bold text-gray-900">
                {activeIndex.index}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Health:</span>
                <HealthBadge color={activeIndex.health} />
              </div>
            </div>
            <div className="p-5">
              <p className="text-3xl font-bold ">
                {activeIndex["docs.count"]?.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 text-center">documents</p>
            </div>
          </div>
        </div>
      )}

      <div className="border rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 bg-gray-50 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Old Indexes</h2>
        </div>
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="whitespace-nowrap font-medium">
                Index Name
              </TableHead>
              <TableHead className="whitespace-nowrap">Documents</TableHead>
              <TableHead className="whitespace-nowrap">Health</TableHead>
              <TableHead className="whitespace-nowrap">Last Modified</TableHead>
              <TableHead className="whitespace-nowrap text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {oldIndexes.map((index) => (
              <TableRow key={index.index}>
                <TableCell className="font-medium">
                  <span className="font-mono text-sm">{index.index}</span>
                </TableCell>
                <TableCell className="">
                  {index["docs.count"]?.toLocaleString()}
                </TableCell>
                <TableCell>
                  <HealthBadge color={index.health} />
                </TableCell>
                <TableCell>
                  {new Date(
                    index?.lastModified || Date.now()
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell className="flex justify-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => swapMutation.mutate(index.index)}
                    disabled={swapMutation.isPending}
                  >
                    {swapMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Make Active
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="hover:bg-red-50 hover:text-red-600 border-red-200 text-red-600"
                    onClick={() => deleteMutation.mutate(index.index)}
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
        <Button
          className="w-full sm:w-auto "
          onClick={() => reindexMutation.mutate()}
          disabled={reindexMutation.isPending}
        >
          {reindexMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Run Full Reindex
        </Button>

        <Button
          variant="outline"
          className="w-full sm:w-auto "
          onClick={() => {
            sessionStorage.removeItem("indexesData");
            refetch();
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RotateCw className="mr-2 h-4 w-4" />
          )}
          Check for Updates Now
        </Button>

        <div className="flex-1 flex items-center gap-4">
          <Label
            htmlFor="refetchInterval"
            className="text-sm font-medium text-gray-700"
          >
            Auto-refresh:
          </Label>
          <div className="relative w-24">
            <Input
              id="refetchInterval"
              type="number"
              min={5}
              value={refetchInterval}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val >= 5) setRefetchInterval(val);
              }}
            />
            <span className="absolute right-3 top-2 text-sm text-gray-500">
              s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexManagement;
