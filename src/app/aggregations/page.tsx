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

const AGGREGATION_TYPES = [
  "avg",
  "sum",
  "min",
  "max",
  "terms",
  "histogram",
  "date_histogram",
];

const AGGREGATION_FIELDS = [
  "price",
  "stock",
  "in_stock",
  "category.keyword",
  "name.keyword",
  "created_at",
];

const AggregationsPage: React.FC = () => {
  const [aggType, setAggType] = useState("avg");
  const [field, setField] = useState("price");
  const [interval, setInterval] = useState(10);
  const [bucketSize, setBucketSize] = useState(5);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ aggType, field });
      if (aggType === "histogram") params.append("interval", String(interval));
      if (aggType === "terms") params.append("size", String(bucketSize));

      const res = await fetch(`/api/aggregations?${params.toString()}`);
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Aggregation fetch failed", error);
    } finally {
      setLoading(false);
    }
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
              {AGGREGATION_FIELDS.map((f) => (
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

        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Loading..." : "Run Aggregation"}
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
