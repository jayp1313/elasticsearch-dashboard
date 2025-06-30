"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { mockAggregations } from "../../lib/mockData";
import { Aggregation } from "../../types/types";
import { toast } from "sonner";

const fetchAggregations = async (): Promise<Aggregation[]> => {
  return mockAggregations;
};

const updateAggregation = async (updatedAgg: Aggregation): Promise<void> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Updated aggregation: ${updatedAgg.id}`);
      resolve();
    }, 500);
  });
};

const AggregationsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const {
    data: aggregations,
    isLoading,
    error,
  } = useQuery<Aggregation[], Error>({
    queryKey: ["aggregations"],
    queryFn: fetchAggregations,
  });

  const mutation = useMutation<void, Error, Aggregation>({
    mutationFn: updateAggregation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aggregations"] });
    },
    onError: (error) => {
      toast.error(`Failed to update aggregation: ${error.message}`);
    },
  });

  const handleToggle = (agg: Aggregation) => {
    mutation.mutate({ ...agg, enabled: !agg.enabled });
  };

  if (isLoading)
    return <div className="text-center py-8">Loading aggregations...</div>;
  if (error)
    return (
      <div className="text-red-500 text-center py-8">
        Error: {error.message}
      </div>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Aggregations Control</h1>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aggregation Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Field</TableHead>
              <TableHead className="text-right">Enabled</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {aggregations?.map((agg) => (
              <TableRow key={agg.id}>
                <TableCell className="font-medium">{agg.name}</TableCell>
                <TableCell>{agg.type}</TableCell>
                <TableCell>{agg.field}</TableCell>
                <TableCell className="text-right">
                  <Switch
                    checked={agg.enabled}
                    onCheckedChange={() => handleToggle(agg)}
                    disabled={mutation.isPending}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-gray-500">
        <p>
          Aggregations help summarize and analyze your data. Enable the ones you
          want to use in search queries.
        </p>
      </div>
    </div>
  );
};

export default AggregationsPage;
