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
import { mockSynonyms } from "../../lib/mockData";
import { Synonym } from "../../types/types";
import { toast } from "sonner";

const fetchSynonyms = async (): Promise<Synonym[]> => {
  return mockSynonyms;
};

const addSynonym = async (terms: string[]): Promise<Synonym> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const newSynonym = { id: Date.now().toString(), terms };
      console.log(`Added synonym: ${terms.join(", ")}`);
      resolve(newSynonym);
    }, 500);
  });
};

const deleteSynonym = async (id: string): Promise<void> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Deleted synonym: ${id}`);
      resolve();
    }, 500);
  });
};

const SynonymsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [newTerm, setNewTerm] = useState("");
  const {
    data: synonyms,
    isLoading,
    error,
  } = useQuery<Synonym[], Error>({
    queryKey: ["synonyms"],
    queryFn: fetchSynonyms,
  });

  const addMutation = useMutation<Synonym, Error, string[]>({
    mutationFn: addSynonym,
    onSuccess: (data) => {
      queryClient.setQueryData<Synonym[]>(["synonyms"], (old) => [
        ...(old || []),
        data,
      ]);
      setNewTerm("");
      toast.success("Synonym set added successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to add synonym set: ${error.message}`);
    },
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: deleteSynonym,
    onSuccess: (_, id) => {
      queryClient.setQueryData<Synonym[]>(
        ["synonyms"],
        (old) => old?.filter((syn) => syn.id !== id) || []
      );
      toast.success("Synonym set removed successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to remove synonym set: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const terms = newTerm
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);
    if (terms.length > 1) {
      addMutation.mutate(terms);
    }
  };

  if (isLoading)
    return <div className="text-center py-8">Loading synonyms...</div>;
  if (error)
    return (
      <div className="text-red-500 text-center py-8">
        Error: {error.message}
      </div>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Synonyms Management</h1>

      <form onSubmit={handleSubmit} className="space-y-2">
        <div>
          <Input
            value={newTerm}
            onChange={(e) => setNewTerm(e.target.value)}
            placeholder="Enter comma-separated synonyms (e.g., tv, television, telly)"
            disabled={addMutation.isPending}
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter at least two related terms separated by commas
          </p>
        </div>
        <Button
          type="submit"
          disabled={
            newTerm.split(",").filter((t) => t.trim()).length < 2 ||
            addMutation.isPending
          }
        >
          {addMutation.isPending ? "Adding..." : "Add Synonym Set"}
        </Button>
      </form>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Synonym Set</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {synonyms?.map((syn) => (
              <TableRow key={syn.id}>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {syn.terms.map((term, i) => (
                      <span
                        key={i}
                        className="bg-gray-100 px-2 py-1 rounded-md text-sm"
                      >
                        {term}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteMutation.mutate(syn.id)}
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
          Synonyms help expand search queries by treating different terms as
          equivalent.
        </p>
      </div>
    </div>
  );
};

export default SynonymsPage;
