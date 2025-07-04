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
    <div className="space-y-6">
      <Header title="Aggregations Control" />
      <div className="text-sm text-gray-500">
        <p>
          Aggregations help summarize and analyze your data. Select the type and
          field to run an aggregation.
        </p>
      </div>

      <div className="flex gap-4 items-end flex-wrap">
        <div>
          <label className="block text-sm font-medium mb-1">
            Aggregation Type
          </label>
          <Select value={aggType} onValueChange={setAggType}>
            <SelectTrigger>
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

        <div>
          <label className="block text-sm font-medium mb-1">Field</label>
          <Select value={field} onValueChange={setField}>
            <SelectTrigger>
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

        {aggType === "histogram" && (
          <div>
            <label className="block text-sm font-medium mb-1">Interval</label>
            <Input
              type="number"
              min={1}
              value={interval}
              onChange={(e) => setInterval(Number(e.target.value))}
            />
          </div>
        )}

        {aggType === "terms" && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Bucket Size
            </label>
            <Input
              type="number"
              min={1}
              value={bucketSize}
              onChange={(e) => setBucketSize(Number(e.target.value))}
            />
          </div>
        )}

        <Button onClick={handleSubmit} disabled={mutation.isPending}>
          {mutation.isPending ? "Loading..." : "Run Aggregation"}
        </Button>
      </div>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Aggregation Result</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AggregationsPage;
