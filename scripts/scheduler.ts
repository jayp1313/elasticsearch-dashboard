import "dotenv/config";
import client from "@/lib/elasticsearchClient";
import { Settings } from "@/types/types";
import fetch from "node-fetch";
import cron, { ScheduledTask } from "node-cron";

const BASE_URL = `${process.env.BASE_URL}/api`;

const runTask = async (path: string) => {
  try {
    const res = await fetch(`${BASE_URL}/tasks/${path}`, { method: "POST" });
    const data = await res.json();
    console.log(`[${path}]`, data);
  } catch (err) {
    console.error(`[${path}]`, err);
  }
};

const getSettings = async (): Promise<Settings> => {
  const res = await client.get({ index: "app-settings", id: "config" });
  return res._source as Settings;
};

let deltaJob: ScheduledTask | null = null;
let reindexJob: ScheduledTask | null = null;

let previousSettings: Settings | null = null;

async function scheduleJobs(settings: Settings) {
  deltaJob?.stop();
  reindexJob?.stop();

  deltaJob = cron.schedule(`*/${settings.deltaUpdateFrequency} * * * *`, () =>
    runTask("delta-updates")
  );

  reindexJob = cron.schedule(
    `*/${settings.fullReindexFrequency} * * * *`,
    async () => {
      await runTask("reindex");
      await runTask("cleanup");
    }
  );

  console.log("Cron jobs (delta/reindex) scheduled with:", settings);
}

cron.schedule("* * * * *", () => runTask("cleanup"));

async function pollAndUpdate() {
  try {
    const current = await getSettings();

    const hasChanged =
      !previousSettings ||
      previousSettings.deltaUpdateFrequency !== current.deltaUpdateFrequency ||
      previousSettings.fullReindexFrequency !== current.fullReindexFrequency;

    if (hasChanged) {
      await scheduleJobs(current);
      previousSettings = current;
    }
  } catch (err) {
    console.error("Failed to poll/update cron settings:", err);
  }
}

pollAndUpdate();

cron.schedule("* * * * *", pollAndUpdate);
