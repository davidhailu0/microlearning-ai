import "dotenv/config";
import { claimNextJob, failJob } from "../lib/repo";
import { processJob } from "../lib/jobs";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log("[worker] started — polling Postgres for queued jobs");

  let running = true;
  process.on("SIGINT", () => {
    running = false;
  });
  process.on("SIGTERM", () => {
    running = false;
  });

  while (running) {
    try {
      const job = await claimNextJob();
      if (!job) {
        await sleep(2000);
        continue;
      }

      console.log(`[worker] ${job.kind} ${job.id}`);
      try {
        await processJob(job.id);
        console.log(`[worker] done ${job.id}`);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Job failed";
        console.error(`[worker] failed ${job.id}: ${message}`);
        await failJob(job.id, message);
      }
    } catch (error) {
      console.error("[worker] poll error", error);
      await sleep(5000);
    }
  }

  console.log("[worker] stopped");
}

void main();
