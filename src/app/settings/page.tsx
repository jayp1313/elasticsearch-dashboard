"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockSettings } from "../../lib/mockData";
import { Settings } from "../../types/types";
import { useState } from "react";

const fetchSettings = async (): Promise<Settings> => {
  return mockSettings; // Replace with API call later
};

const updateSettings = async (newSettings: Settings): Promise<void> => {
  console.log("Updating settings:", newSettings); // Simulate API call
};

const SettingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const {
    data: settings,
    isLoading,
    error,
  } = useQuery<Settings, Error>({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });
  const [form, setForm] = useState<Partial<Settings>>({});

  const mutation = useMutation<void, Error, Settings>({
    mutationFn: updateSettings,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["settings"] }),
  });

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ ...settings, ...form });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Old Indexes to Keep (default: 3)</label>
          <Input
            type="number"
            min="1"
            defaultValue={settings?.oldIndexesToKeep}
            onChange={(e) =>
              setForm({ ...form, oldIndexesToKeep: Number(e.target.value) })
            }
          />
        </div>
        <div>
          <label className="block mb-1">Delta Update Frequency (minutes)</label>
          <Input
            type="number"
            min="1"
            defaultValue={settings?.deltaUpdateFrequency}
            onChange={(e) =>
              setForm({ ...form, deltaUpdateFrequency: Number(e.target.value) })
            }
          />
        </div>
        <div>
          <label className="block mb-1">Full Reindex Frequency (minutes)</label>
          <Input
            type="number"
            min="1"
            defaultValue={settings?.fullReindexFrequency}
            onChange={(e) =>
              setForm({ ...form, fullReindexFrequency: Number(e.target.value) })
            }
          />
        </div>
        <Button type="submit">Save Settings</Button>
      </form>
    </div>
  );
};

export default SettingsPage;
