"use client";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Stopword } from "../../types/types";
import { Header } from "@/components/Header";
import Loader from "../utility/Loader";

const fetchStopwords = async (): Promise<Stopword[]> => {
  const res = await fetch("/api/stopwords");
  if (!res.ok) throw new Error("Failed to load stopwords");
  const data = await res.json();

  return (data.stopwords || []).map((word: string) => ({
    id: word,
    value: word,
  }));
};

const StopwordsPage: React.FC = () => {
  const {
    data: stopwords,
    isLoading,
    error,
  } = useQuery<Stopword[], Error>({
    queryKey: ["stopwords"],
    queryFn: fetchStopwords,
  });

  if (isLoading) return <Loader />;
  if (error)
    return (
      <div className="text-red-500 text-center py-8">
        Error: {error.message}
      </div>
    );

  return (
    <div className="space-y-6">
      <Header title="Stopwords" />
      <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg border">
        <p className="leading-6">
          {" "}
          Stopwords are common words that are excluded from search queries to
          improve performance.
        </p>
      </div>

      <div className="border rounded-lg overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="whitespace-nowrap">Stopword</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stopwords?.map((word) => (
              <TableRow key={word.id}>
                <TableCell className="font-medium">{word.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StopwordsPage;
