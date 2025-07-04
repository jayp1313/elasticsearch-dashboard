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
import { useState } from "react";
import { Stopword } from "../../types/types";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import Loader from "../utility/Loader";
import { Loader2 } from "lucide-react";

const fetchStopwords = async (): Promise<Stopword[]> => {
  const res = await fetch("/api/stopwords");
  if (!res.ok) throw new Error("Failed to load stopwords");
  const data = await res.json();

  return (data.stopwords || []).map((word: string) => ({
    id: word,
    value: word,
  }));
};

const addStopword = async (value: string): Promise<Stopword> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newStopword = { id: Date.now().toString(), value };
      console.log(`Added stopword: ${value}`);
      resolve(newStopword);
    }, 500);
  });
};

const deleteStopword = async (id: string): Promise<void> => {
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

  if (isLoading) return <Loader />;
  if (error)
    return (
      <div className="text-red-500 text-center py-8">
        Error: {error.message}
      </div>
    );

  return (
    <div className="space-y-6">
      <Header title="Stopwords Management" />
      <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg border">
        <p className="leading-6">
          {" "}
          Stopwords are common words that are excluded from search queries to
          improve performance.
        </p>
      </div>
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

      <div className="border rounded-lg overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="whitespace-nowrap">Stopword</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stopwords?.map((word) => (
              <TableRow key={word.id}>
                <TableCell className="font-medium">{word.value}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    className="hover:bg-red-50 hover:text-red-600 border-red-200 text-red-600"
                    onClick={() => deleteMutation.mutate(word.id)}
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
    </div>
  );
};

export default StopwordsPage;
