import { getDb } from "@/lib/repo";

async function main() {
  const db = await getDb();
  
  // Try listing courses - but demo mode may override
  const courses = await db.select().from(db.$.tables.courses);
  console.log('All courses (raw):', courses.length);
  
  for (const c of courses) {
    console.log('  course:', c.id, c.title?.slice(0, 40));
    
    const lessons = await db.select().from(db.$.tables.lessons).where(db.eq(db.$.tables.lessons.courseId, c.id));
    console.log('  lessons:', lessons.length);
    
    for (const l of lessons) {
      console.log('    lesson:', l.id, l.title?.slice(0, 40));
    }
  }
  
  await db.end();
}

main().catch(e => console.error('ERROR:', e));