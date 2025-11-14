CREATE TABLE "resume_statistics" (
	"id" text PRIMARY KEY NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"downloads" integer DEFAULT 0 NOT NULL,
	"last_viewed_at" timestamp,
	"last_downloaded_at" timestamp,
	"resume_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "resume_statistics" ADD CONSTRAINT "resume_statistics_resume_id_resume_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resume"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "resume_is_public_slug_user_id_index" ON "resume" USING btree ("is_public","slug","user_id");