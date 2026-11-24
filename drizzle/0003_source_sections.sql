CREATE TABLE "source_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" uuid NOT NULL,
	"section_index" integer NOT NULL,
	"title" text NOT NULL,
	"text" text NOT NULL,
	"word_count" integer DEFAULT 0 NOT NULL,
	"page_start" integer,
	"page_end" integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX "source_sections_course_idx" ON "source_sections" USING btree ("course_id","section_index");--> statement-breakpoint
ALTER TABLE "source_sections" ADD CONSTRAINT "source_sections_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
