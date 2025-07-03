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
import { SynonymSet } from "@/types/types";
import { v4 as uuidv4 } from "uuid";
import { Header } from "@/components/Header";
import { toast } from "sonner";

const fetchSynonyms = async (): Promise<SynonymSet> => {
  const res = await fetch("/api/synonyms");
  if (!res.ok) throw new Error("Failed to fetch synonyms");
  return res.json();
};

const postSynonym = async (synonyms: string) => {
  const body = {
    set_id: "new-synonyms",
    rule_id: uuidv4(),
    synonyms,
  };
  const res = await fetch("/api/synonyms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create synonym");
  }
  return res.json();
};

const deleteSynonym = async (rule_id: string) => {
  const res = await fetch("/api/synonyms", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      set_id: "new-synonyms",
      rule_id,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to delete synonym");
  }

  return res.json();
};

const SynonymsPage = () => {
  const [newTerm, setNewTerm] = useState("");
  const queryClient = useQueryClient();

  const {
    data: synonyms,
    isError,
    isLoading,
  } = useQuery<SynonymSet>({
    queryKey: ["synonyms"],
    queryFn: fetchSynonyms,
  });

  const addMutation = useMutation({
    mutationFn: postSynonym,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["synonyms"] });
      toast.success("Synonym added successfully!");
      setNewTerm("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSynonym,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["synonyms"] });
      toast.success("Synonym  deleted successfully!");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMutation.mutate(newTerm.trim());
  };

  if (isLoading)
    return <div className="text-center py-8">Loading synonyms...</div>;

  if (isError)
    return (
      <div className="text-red-500 text-center py-8">
        Error loading synonyms.
      </div>
    );

  return (
    <div className="space-y-6">
      <Header title="Synonyms Management" />
      <form onSubmit={handleSubmit} className="space-y-2">
        <div>
          <Input
            value={newTerm}
            onChange={(e) => setNewTerm(e.target.value)}
            placeholder="e.g., tv, television, telly"
            disabled={addMutation.isPending}
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter at least two related terms separated by commas
          </p>
        </div>
        <Button
          type="submit"
          disabled={
            newTerm
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean).length < 2 || addMutation.isPending
          }
        >
          {addMutation.isPending ? "Adding…" : "Add Synonym Set"}
        </Button>
      </form>

      {addMutation.isError && (
        <p className="text-red-500 text-sm">
          {(addMutation.error as Error).message}
        </p>
      )}

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Synonym Set</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {synonyms?.synonyms_set.map((syn) => (
              <TableRow key={syn.id}>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {syn.synonyms.split(",").map((term, i) => (
                      <span
                        key={i}
                        className="bg-gray-100 px-2 py-1 rounded-md text-sm"
                      >
                        {term.trim()}
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
