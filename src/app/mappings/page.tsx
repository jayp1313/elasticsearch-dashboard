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
import Loader from "../utility/Loader";

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

  if (isLoading) return <Loader />;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div className="space-y-6">
      <Header title="Index Mappings" />
      <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg border">
        <p className="leading-6">
          Mappings define the structure of documents in an index, including
          field types and data formats.
        </p>
      </div>

      {mapping &&
        Object.entries(mapping).map(([indexName, { mappings }]) => (
          <div key={indexName} className="mb-10 space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-semibold">Active Index</h2>
                  <p className="text-lg">{indexName}</p>
                </div>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead className="whitespace-nowrap">
                      Field Name
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      Data Type
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(mappings.properties || {}).map(
                    ([field, prop]) => (
                      <TableRow key={field}>
                        <TableCell>{field}</TableCell>
                        <TableCell>{prop.type || "object"}</TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        ))}
    </div>
  );
};

export default MappingsPage;
