"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings } from "../../types/types";
import { useState } from "react";
import { Header } from "@/components/Header";
import { toast } from "sonner";

const fetchSettings = async (): Promise<Settings> => {
  const res = await fetch("/api/settings");
  if (!res.ok) throw new Error("Failed to fetch settings");
  return res.json();
};

const updateSettings = async (newSettings: Settings) => {
  const res = await fetch("/api/settings", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newSettings),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to update settings");
  }

  return res.json();
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
    refetchOnWindowFocus: false,
  });
  const [form, setForm] = useState<Partial<Settings>>({});

  const mutation = useMutation<void, Error, Settings>({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Settings updated successfully!");
    },
  });

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      ...settings!,
      ...form,
    });
  };

  return (
    <div className="space-y-6">
      <Header title="Settings" />
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
