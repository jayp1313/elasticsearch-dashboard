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
import { Mapping } from "../../types/types";
import { Header } from "@/components/Header";

const fetchMapping = async (): Promise<Mapping> => {
  const res = await fetch("/api/mappings");
  if (!res.ok) throw new Error("Failed to fetch mappings");
  return res.json();
};

const MappingsPage: React.FC = () => {
  const {
    data: mapping,
    isLoading,
    error,
  } = useQuery<Mapping, Error>({
    queryKey: ["mapping"],
    queryFn: fetchMapping,
  });

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div>
      <Header title="Index Mappings" />
      {Object.entries(mapping).map(([indexName, { mappings }]) => (
        <div key={indexName} className="mb-10">
          <h2 className="text-xl font-semibold mb-2">{indexName}</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field Name</TableHead>
                <TableHead>Data Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(mappings.properties).map(([field, prop]) => (
                <TableRow key={field}>
                  <TableCell>{field}</TableCell>
                  <TableCell>{prop.type || "object"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
};

export default MappingsPage;
