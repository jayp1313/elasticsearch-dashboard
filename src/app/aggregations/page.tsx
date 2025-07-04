"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AggregationParams } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import { Loader2, BarChart4, Copy } from "lucide-react";
import { Label } from "@/components/ui/label";

const AGGREGATION_TYPES = [
  "avg",
  "sum",
  "min",
  "max",
  "terms",
  "histogram",
  "date_histogram",
];

const AGGREGATION_FIELDS_MAP: Record<string, string[]> = {
  avg: ["price", "stock"],
  sum: ["price", "stock"],
  min: ["price", "stock"],
  max: ["price", "stock"],
  terms: ["category.keyword", "name.keyword", "in_stock"],
  histogram: ["price", "stock"],
  date_histogram: ["created_at"],
};

const fetchAggregation = async ({
  aggType,
  field,
  interval,
  size,
}: AggregationParams): Promise<AggregationParams> => {
  const params = new URLSearchParams({ aggType, field });
  if (aggType === "histogram" && interval)
    params.append("interval", interval.toString());
  if (aggType === "terms" && size) params.append("size", size.toString());

  const res = await fetch(`/api/aggregations?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch aggregation");

  return res.json();
};

const AggregationsPage: React.FC = () => {
  const [aggType, setAggType] = useState("avg");
  const [field, setField] = useState("price");
  const [interval, setInterval] = useState(10);
  const [bucketSize, setBucketSize] = useState(5);
  const [result, setResult] = useState<AggregationParams>();

  const allowedFields = AGGREGATION_FIELDS_MAP[aggType] || [];

  const mutation = useMutation({
    mutationFn: (params: AggregationParams) => fetchAggregation(params),
    onSuccess: (data) => setResult(data),
    onError: (error: Error) => {
      console.error("Aggregation fetch failed", error.message);
    },
  });

  const handleSubmit = () => {
    mutation.mutate({
      aggType,
      field,
      interval:
        aggType === "histogram" || aggType === "date_histogram"
          ? interval
          : undefined,
      size: aggType === "terms" ? bucketSize : undefined,
    });
  };

  return (
    <div className="space-y-8">
      <Header title="Aggregations Control" />

      <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg border">
        <p className="leading-6">
          Aggregations help summarize and analyze your data. Select the type and
          field to run an aggregation.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Aggregation Type</Label>
            <Select value={aggType} onValueChange={setAggType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {AGGREGATION_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Field</Label>
            <Select value={field} onValueChange={setField}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent>
                {allowedFields.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {aggType === "histogram" ? (
            <div className="space-y-2">
              <Label>Interval</Label>
              <Input
                type="number"
                min={1}
                value={interval}
                onChange={(e) => setInterval(Number(e.target.value))}
                className="w-full"
              />
            </div>
          ) : aggType === "terms" ? (
            <div className="space-y-2">
              <Label>Bucket Size</Label>
              <Input
                type="number"
                min={1}
                value={bucketSize}
                onChange={(e) => setBucketSize(Number(e.target.value))}
                className="w-full"
              />
            </div>
          ) : (
            <div className="hidden md:block"></div>
          )}

          <div className="flex items-end justify-end">
            <Button
              onClick={handleSubmit}
              disabled={mutation.isPending}
              className="w-full md:w-auto"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Run Aggregation"
              )}
            </Button>
          </div>
        </div>
      </div>

      {result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart4 className="h-5 w-5 text-primary" />
              Aggregation Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="text-sm p-4 rounded-lg bg-muted overflow-auto max-h-[500px]">
                {JSON.stringify(result, null, 2)}
              </pre>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-4"
                onClick={() =>
                  navigator.clipboard.writeText(JSON.stringify(result, null, 2))
                }
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AggregationsPage;
