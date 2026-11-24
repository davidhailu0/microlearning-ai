CREATE TABLE "checkpoint_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"checkpoint_index" integer NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"total" integer DEFAULT 0 NOT NULL,
	"completed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "checkpoint_progress_user_course_idx" ON "checkpoint_progress" USING btree ("user_id","course_id","checkpoint_index");--> statement-breakpoint
ALTER TABLE "checkpoint_progress" ADD CONSTRAINT "checkpoint_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checkpoint_progress" ADD CONSTRAINT "checkpoint_progress_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
