"use client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockIndexes } from "../lib/mockData";
import { Index } from "../types/types";
import HealthBadge from "../components/HealthBadge";

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

  const activeIndex = indexes?.find((index) => index.alias === "products");
  const totalDocuments =
    indexes?.reduce((sum, index) => sum + index.documentCount, 0) || 0;

  if (isLoading)
    return <div className="text-center py-8">Loading dashboard data...</div>;
  if (error)
    return (
      <div className="text-red-500 text-center py-8">
        Error: {error.message}
      </div>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Elasticsearch Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Active Index</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">
              {activeIndex?.indexName || "N/A"}
            </p>
            <p className="text-sm text-gray-500">
              Alias: {activeIndex?.alias || "None"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {totalDocuments.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Index Health</CardTitle>
          </CardHeader>
          <CardContent>
            {activeIndex ? (
              <HealthBadge status={activeIndex.healthStatus} />
            ) : (
              <Badge variant="secondary">No active index</Badge>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Product Indexes</CardTitle>
        </CardHeader>
        <CardContent>
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
                  className={index.alias ? "bg-blue-50" : ""}
                >
                  <TableCell className="font-medium">
                    {index.indexName}
                  </TableCell>
                  <TableCell>
                    {index.alias ? (
                      <Badge variant="default">{index.alias}</Badge>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell>{index.documentCount.toLocaleString()}</TableCell>
                  <TableCell>
                    <HealthBadge status={index.healthStatus} />
                  </TableCell>
                  <TableCell>
                    {new Date(index.lastModified).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
