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
import { mockMapping } from "../../lib/mockData";
import { Mapping } from "../../types/types";

const fetchMapping = async (): Promise<Mapping> => {
  return mockMapping; // Replace with API call later
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
      <h1 className="text-2xl font-bold mb-4">Index Mappings</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Field Name</TableHead>
            <TableHead>Data Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mapping &&
            Object.entries(mapping.properties).map(([field, { type }]) => (
              <TableRow key={field}>
                <TableCell>{field}</TableCell>
                <TableCell>{type}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MappingsPage;
