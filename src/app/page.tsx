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
import { mockIndexes } from "../lib/mockData";
import { Index } from "../types/types";

const fetchIndexes = async (): Promise<Index[]> => {
  return mockIndexes;
};

export default function Dashboard() {
  const {
    data: indexes,
    isLoading,
    error,
  } = useQuery<Index[], Error>({
    queryKey: ["indexes"],
    queryFn: fetchIndexes,
  });

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Elasticsearch Dashboard</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Index Name</TableHead>
            <TableHead>Alias</TableHead>
            <TableHead>Documents</TableHead>
            <TableHead>Health</TableHead>
            <TableHead>Last Modified</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {indexes?.map((index) => (
            <TableRow
              key={index.indexName}
              className={index.alias ? "bg-gray-100" : ""}
            >
              <TableCell>{index.indexName}</TableCell>
              <TableCell>{index.alias || "N/A"}</TableCell>
              <TableCell>{index.documentCount}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded text-white ${
                    index.healthStatus === "green"
                      ? "bg-green-500"
                      : index.healthStatus === "yellow"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                >
                  {index.healthStatus}
                </span>
              </TableCell>
              <TableCell>
                {new Date(index.lastModified).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
