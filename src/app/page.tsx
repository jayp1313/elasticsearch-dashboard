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
import { Index } from "@/types/types";
import { Header } from "@/components/Header";

const fetchIndexes = async (): Promise<Index[]> => {
  if (typeof window !== "undefined") {
    const cached = sessionStorage.getItem("elasticsearch_indexes");
    if (cached) return JSON.parse(cached);
  }

  const res = await fetch("/api/indexes");
  if (!res.ok) throw new Error("Failed to fetch indexes");

  const data = await res.json();
  if (typeof window !== "undefined") {
    sessionStorage.setItem("elasticsearch_indexes", JSON.stringify(data));
  }

  return data;
};

export const fetchActiveIndex = async (): Promise<{
  activeIndex: string;
  alias: string;
}> => {
  const cached = sessionStorage.getItem("active_index");
  if (cached) return JSON.parse(cached);

  const res = await fetch("/api/active-index");
  if (!res.ok) throw new Error("Failed to fetch active index");

  const data = await res.json();
  sessionStorage.setItem("active_index", JSON.stringify(data));
  return data;
};

export default function Dashboard() {
  const {
    data: indexes,
    isLoading,
    error,
  } = useQuery<Index[]>({
    queryKey: ["indexes"],
    queryFn: fetchIndexes,
  });

  const { data: activeIndex } = useQuery({
    queryKey: ["active-index"],
    queryFn: fetchActiveIndex,
  });

  const totalDocuments =
    indexes?.reduce(
      (sum, index) => sum + parseInt(index["docs.count"] || "0", 10),
      0
    ) || 0;

  const activeIndexHealth = indexes?.find(
    (index) => index.index === activeIndex?.activeIndex
  )?.health;

  if (isLoading)
    return <div className="text-center py-8">Loading dashboard data...</div>;

  if (error instanceof Error)
    return (
      <div className="text-red-500 text-center py-8">
        Error: {error.message}
      </div>
    );

  return (
    <div className="space-y-6 px-4 md:px-0">
      <Header title="Elasticsearch Dashboard" />

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Active Index</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg md:text-xl font-semibold break-words">
              {activeIndex?.activeIndex || "N/A"}
            </p>
            <p className="text-sm text-gray-500 break-words">
              Alias: {activeIndex?.alias || "None"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">
              Total Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-3xl font-bold">
              {totalDocuments.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Index Health</CardTitle>
          </CardHeader>
          <CardContent>
            {activeIndex ? (
              <HealthBadge status={activeIndexHealth || "unknown"} />
            ) : (
              <Badge variant="secondary">No active index</Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>All Product Indexes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">
                    Index Name
                  </TableHead>
                  <TableHead className="whitespace-nowrap">Alias</TableHead>
                  <TableHead className="whitespace-nowrap">Docs</TableHead>
                  <TableHead className="whitespace-nowrap">Health</TableHead>
                  <TableHead className="whitespace-nowrap">Size</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {indexes?.map((index) => (
                  <TableRow
                    key={index.index}
                    className={index.alias ? "bg-blue-50" : ""}
                  >
                    <TableCell className="font-medium whitespace-nowrap">
                      {index.index}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {index.alias ? (
                        <Badge variant="default">{index.alias}</Badge>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {index["docs.count"]}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <HealthBadge status={index.health} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {index["store.size"] || "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
