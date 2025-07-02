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
import HealthBadge from "../components/HealthBadge";

interface Root {
  health: string;
  status: string;
  index: string;
  uuid: string;
  pri: string;
  rep: string;
  "docs.count": string;
  "docs.deleted": string;
  "store.size": string;
  "pri.store.size": string;
  alias?: string;
}

const fetchIndexes = async (): Promise<Root[]> => {
  if (typeof window !== "undefined") {
    const cached = sessionStorage.getItem("elasticsearch_indexes");
    if (cached) {
      return JSON.parse(cached);
    }
  }

  const res = await fetch("/api/indexes");
  if (!res.ok) throw new Error("Failed to fetch indexes");

  const data = await res.json();

  if (typeof window !== "undefined") {
    sessionStorage.setItem("elasticsearch_indexes", JSON.stringify(data));
  }

  return data;
};

export default function Dashboard() {
  const {
    data: indexes,
    isLoading,
    error,
  } = useQuery<Root[]>({
    queryKey: ["indexes"],
    queryFn: fetchIndexes,
  });

  const activeIndex = indexes?.find((index) => index.alias === "products");

  const totalDocuments =
    indexes?.reduce(
      (sum, index) => sum + parseInt(index["docs.count"] || "0", 10),
      0
    ) || 0;

  if (isLoading)
    return <div className="text-center py-8">Loading dashboard data...</div>;

  if (error instanceof Error)
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
              {activeIndex?.index || "N/A"}
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
              <HealthBadge status={activeIndex.health} />
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
                <TableHead>Size</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {indexes?.map((index) => (
                <TableRow
                  key={index.index}
                  className={index.alias ? "bg-blue-50" : ""}
                >
                  <TableCell className="font-medium">{index.index}</TableCell>
                  <TableCell>
                    {index.alias ? (
                      <Badge variant="default">{index.alias}</Badge>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell>{index["docs.count"]}</TableCell>
                  <TableCell>
                    <HealthBadge status={index.health} />
                  </TableCell>
                  <TableCell>{index["store.size"] || "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
