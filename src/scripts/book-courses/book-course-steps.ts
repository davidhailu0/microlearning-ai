import { bookCourseStepsA } from "./book-course-steps-a";
import { bookCourseStepsB } from "./book-course-steps-b";

/** Combined hands-on steps for all technical book courses. */
export const bookCourseSteps = {
  ...bookCourseStepsA,
  ...bookCourseStepsB,
};
