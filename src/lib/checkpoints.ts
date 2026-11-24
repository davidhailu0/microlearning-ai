export type CheckpointRange = { start: number; end: number; size: number };

const TARGET_SIZE = 5;
const PREFERRED_SIZE = 4;

/**
 * Split lessons into cumulative checkpoints of at most five lessons. Start
 * from four-lesson blocks and promote later blocks to five where possible.
 * Short remainders stay at the end, so the first review always happens after
 * four or five lessons: 6 => 4+2, 7 => 4+3, 11 => 4+4+3.
 */
export function checkpointRanges(total: number): CheckpointRange[] {
  if (total <= 0) return [];

  const groups = Math.ceil(total / TARGET_SIZE);
  const sizes = Array.from({ length: groups }, () => PREFERRED_SIZE);
  let difference = total - PREFERRED_SIZE * groups;

  for (let index = groups - 1; index >= 0 && difference > 0; index -= 1) {
    sizes[index] += 1;
    difference -= 1;
  }
  if (difference < 0) {
    // Short courses keep the first block at four lessons and shorten the tail.
    sizes[groups - 1] += difference;
  }

  let start = 0;
  const ranges = sizes.map((size) => {
    const range = { start, end: start + size, size };
    start += size;
    return range;
  });

  // If the tail is shorter than four, slide the final checkpoint backward and
  // overlap the previous one. Every block stays 4–5 lessons without a tiny
  // final review: 6 => 1–4, 3–6; 7 => 1–4, 4–7; 11 => 1–4, 5–8, 8–11.
  const lastIndex = ranges.length - 1;
  const last = ranges[lastIndex];
  if (ranges.length > 1 && last && last.size < PREFERRED_SIZE) {
    ranges[lastIndex] = { start: total - PREFERRED_SIZE, end: total, size: PREFERRED_SIZE };
  }

  return ranges;
}

/** The checkpoint that ends exactly at this 1-based completed lesson count. */
export function checkpointForCompleted(total: number, completed: number): number | null {
  const index = checkpointRanges(total).findIndex((range) => range.end === completed);
  return index >= 0 ? index + 1 : null;
}
