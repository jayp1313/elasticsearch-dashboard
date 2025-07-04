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
import Loader from "./utility/Loader";

const fetchIndexes = async (): Promise<Index[]> => {
  const cacheKey = "indexesData";
  const cachedData = sessionStorage.getItem(cacheKey);
  if (cachedData) {
    try {
      return JSON.parse(cachedData);
    } catch (error) {
      console.warn("Failed to parse cached indexes:", error);
    }
  }
  const res = await fetch("/api/indexes");
  if (!res.ok) throw new Error("Failed to fetch indexes");
  const data: Index[] = await res.json();
  sessionStorage.setItem(cacheKey, JSON.stringify(data));
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

  const totalDocuments =
    indexes?.reduce(
      (sum, index) => sum + parseInt(index["docs.count"] || "0", 10),
      0
    ) || 0;

  const activeIndex = indexes?.find((index) => index.alias === "products");

  if (isLoading) return <Loader />;

  if (error instanceof Error)
    return (
      <div className="text-red-500 text-center py-8">
        Error: {error.message}
      </div>
    );

  return (
    <div className="space-y-6 px-4 md:px-0">
      <Header title="Dashboard" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Active Index</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg md:text-xl font-semibold break-words">
              {activeIndex?.index || "N/A"}
            </p>
            <p className="text-sm text-gray-500 break-words">
              Alias: {activeIndex?.alias || "None"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
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

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Index Health</CardTitle>
          </CardHeader>
          <CardContent>
            {activeIndex ? (
              <HealthBadge color={activeIndex.health || "unknown"} />
            ) : (
              <Badge>No active index</Badge>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="border rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 bg-gray-50 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Old Indexes</h2>
        </div>
        <div className="overflow-x-auto">
          {" "}
          {/* Add this wrapper */}
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="whitespace-nowrap font-medium">
                  Index Name
                </TableHead>
                <TableHead className="whitespace-nowrap">Alias</TableHead>
                <TableHead className="whitespace-nowrap">Documents</TableHead>
                <TableHead className="whitespace-nowrap">Health</TableHead>
                <TableHead className="whitespace-nowrap">Size</TableHead>
                <TableHead className="whitespace-nowrap">
                  Last Modified
                </TableHead>
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
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {index["docs.count"]}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <HealthBadge color={index.health} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {index["store.size"] || "N/A"}
                  </TableCell>
                  <TableCell>{index.lastModified.toString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
