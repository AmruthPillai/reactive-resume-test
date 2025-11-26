import { boolean, index, integer, jsonb, pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";
import { defaultResumeData, type ResumeData } from "@/schema/resume/data";
import { generateId } from "@/utils/string";

export const user = pgTable("user", {
	id: text("id")
		.notNull()
		.primaryKey()
		.$defaultFn(() => generateId()),
	image: text("image"),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").notNull().default(false),
	username: text("username").notNull().unique(),
	displayUsername: text("display_username").notNull().unique(),
	twoFactorEnabled: boolean("two_factor_enabled").notNull().default(false),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date()),
});

export const session = pgTable(
	"session",
	{
		id: text("id")
			.notNull()
			.primaryKey()
			.$defaultFn(() => generateId()),
		token: text("token").notNull().unique(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		expiresAt: timestamp("expires_at").notNull(),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at")
			.notNull()
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date()),
	},
	(t) => [index().on(t.token, t.userId)],
);

export const account = pgTable(
	"account",
	{
		id: text("id")
			.notNull()
			.primaryKey()
			.$defaultFn(() => generateId()),
		accountId: text("account_id").notNull(),
		providerId: text("provider_id").notNull().default("credential"),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		scope: text("scope"),
		idToken: text("id_token"),
		password: text("password"),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		accessTokenExpiresAt: timestamp("access_token_expires_at"),
		refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at")
			.notNull()
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date()),
	},
	(t) => [index().on(t.userId)],
);

export const verification = pgTable("verification", {
	id: text("id")
		.notNull()
		.primaryKey()
		.$defaultFn(() => generateId()),
	identifier: text("identifier").notNull().unique(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date()),
});

export const twoFactor = pgTable(
	"two_factor",
	{
		id: text("id")
			.notNull()
			.primaryKey()
			.$defaultFn(() => generateId()),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		secret: text("secret"),
		backupCodes: text("backup_codes"),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at")
			.notNull()
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date()),
	},
	(t) => [index().on(t.userId)],
);

export const passkey = pgTable(
	"passkey",
	{
		id: text("id")
			.notNull()
			.primaryKey()
			.$defaultFn(() => generateId()),
		name: text("name"),
		aaguid: text("aaguid"),
		publicKey: text("public_key").notNull(),
		credentialID: text("credential_id").notNull(),
		counter: integer("counter").notNull(),
		deviceType: text("device_type").notNull(),
		backedUp: boolean("backed_up").notNull().default(false),
		transports: text("transports").notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at")
			.notNull()
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date()),
	},
	(t) => [index().on(t.userId)],
);

export const resume = pgTable(
	"resume",
	{
		id: text("id")
			.notNull()
			.primaryKey()
			.$defaultFn(() => generateId()),
		name: text("name").notNull(),
		slug: text("slug").notNull(),
		tags: text("tags").array().notNull().default([]),
		isPublic: boolean("is_public").notNull().default(false),
		isLocked: boolean("is_locked").notNull().default(false),
		password: text("password"),
		data: jsonb("data")
			.notNull()
			.$type<ResumeData>()
			.$defaultFn(() => defaultResumeData),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at")
			.notNull()
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date()),
	},
	(t) => [unique().on(t.slug, t.userId), index().on(t.isPublic, t.slug, t.userId)],
);

export const resumeStatistics = pgTable("resume_statistics", {
	id: text("id")
		.notNull()
		.primaryKey()
		.$defaultFn(() => generateId()),
	views: integer("views").notNull().default(0),
	downloads: integer("downloads").notNull().default(0),
	lastViewedAt: timestamp("last_viewed_at"),
	lastDownloadedAt: timestamp("last_downloaded_at"),
	resumeId: text("resume_id")
		.unique()
		.notNull()
		.references(() => resume.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date()),
});
