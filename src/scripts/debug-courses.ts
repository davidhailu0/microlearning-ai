import { dbEnabled, demoUserId } from "./src/lib/env";
import { demoUserCourses } from "./src/lib/repo";

async function main() {
  console.log("dbEnabled:", dbEnabled());
  console.log("demoUserId:", demoUserId);
  const courses = await demoUserCourses(200);
  console.log("Number of demo courses:", courses.length);
  courses.forEach((c: any, i: number) => {
    console.log(`Course ${i}:`, c.id, c.title?.slice(0, 50));
  });
}

main().catch(e => { console.error("FATAL:", e); process.exit(1); });