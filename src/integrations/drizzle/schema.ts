import * as pg from "drizzle-orm/pg-core";
import { defaultResumeData, type ResumeData } from "@/schema/resume/data";
import { generateId } from "@/utils/string";

export const user = pg.pgTable("user", {
	id: pg
		.text("id")
		.notNull()
		.primaryKey()
		.$defaultFn(() => generateId()),
	image: pg.text("image"),
	name: pg.text("name").notNull(),
	email: pg.text("email").notNull().unique(),
	emailVerified: pg.boolean("email_verified").notNull().default(false),
	username: pg.text("username").notNull().unique(),
	displayUsername: pg.text("display_username").notNull().unique(),
	twoFactorEnabled: pg.boolean("two_factor_enabled").notNull().default(false),
	createdAt: pg.timestamp("created_at").notNull().defaultNow(),
	updatedAt: pg
		.timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date()),
});

export const session = pg.pgTable(
	"session",
	{
		id: pg
			.text("id")
			.notNull()
			.primaryKey()
			.$defaultFn(() => generateId()),
		token: pg.text("token").notNull().unique(),
		ipAddress: pg.text("ip_address"),
		userAgent: pg.text("user_agent"),
		userId: pg
			.text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		expiresAt: pg.timestamp("expires_at").notNull(),
		createdAt: pg.timestamp("created_at").notNull().defaultNow(),
		updatedAt: pg
			.timestamp("updated_at")
			.notNull()
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date()),
	},
	(t) => [pg.index().on(t.token, t.userId)],
);

export const account = pg.pgTable(
	"account",
	{
		id: pg
			.text("id")
			.notNull()
			.primaryKey()
			.$defaultFn(() => generateId()),
		accountId: pg.text("account_id").notNull(),
		providerId: pg.text("provider_id").notNull().default("credential"),
		userId: pg
			.text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		scope: pg.text("scope"),
		idToken: pg.text("id_token"),
		password: pg.text("password"),
		accessToken: pg.text("access_token"),
		refreshToken: pg.text("refresh_token"),
		accessTokenExpiresAt: pg.timestamp("access_token_expires_at"),
		refreshTokenExpiresAt: pg.timestamp("refresh_token_expires_at"),
		createdAt: pg.timestamp("created_at").notNull().defaultNow(),
		updatedAt: pg
			.timestamp("updated_at")
			.notNull()
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date()),
	},
	(t) => [pg.index().on(t.userId)],
);

export const verification = pg.pgTable("verification", {
	id: pg
		.text("id")
		.notNull()
		.primaryKey()
		.$defaultFn(() => generateId()),
	identifier: pg.text("identifier").notNull().unique(),
	value: pg.text("value").notNull(),
	expiresAt: pg.timestamp("expires_at").notNull(),
	createdAt: pg.timestamp("created_at").notNull().defaultNow(),
	updatedAt: pg
		.timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date()),
});

export const twoFactor = pg.pgTable(
	"two_factor",
	{
		id: pg
			.text("id")
			.notNull()
			.primaryKey()
			.$defaultFn(() => generateId()),
		userId: pg
			.text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		secret: pg.text("secret"),
		backupCodes: pg.text("backup_codes"),
		createdAt: pg.timestamp("created_at").notNull().defaultNow(),
		updatedAt: pg
			.timestamp("updated_at")
			.notNull()
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date()),
	},
	(t) => [pg.index().on(t.userId)],
);

export const passkey = pg.pgTable(
	"passkey",
	{
		id: pg
			.text("id")
			.notNull()
			.primaryKey()
			.$defaultFn(() => generateId()),
		name: pg.text("name"),
		aaguid: pg.text("aaguid"),
		publicKey: pg.text("public_key").notNull(),
		credentialID: pg.text("credential_id").notNull(),
		counter: pg.integer("counter").notNull(),
		deviceType: pg.text("device_type").notNull(),
		backedUp: pg.boolean("backed_up").notNull().default(false),
		transports: pg.text("transports").notNull(),
		userId: pg
			.text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		createdAt: pg.timestamp("created_at").notNull().defaultNow(),
		updatedAt: pg
			.timestamp("updated_at")
			.notNull()
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date()),
	},
	(t) => [pg.index().on(t.userId)],
);

export const resume = pg.pgTable(
	"resume",
	{
		id: pg
			.text("id")
			.notNull()
			.primaryKey()
			.$defaultFn(() => generateId()),
		name: pg.text("name").notNull(),
		slug: pg.text("slug").notNull(),
		tags: pg.text("tags").array().notNull().default([]),
		isPublic: pg.boolean("is_public").notNull().default(false),
		isLocked: pg.boolean("is_locked").notNull().default(false),
		password: pg.text("password"),
		data: pg
			.jsonb("data")
			.notNull()
			.$type<ResumeData>()
			.$defaultFn(() => defaultResumeData),
		userId: pg
			.text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		createdAt: pg.timestamp("created_at").notNull().defaultNow(),
		updatedAt: pg
			.timestamp("updated_at")
			.notNull()
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date()),
	},
	(t) => [pg.unique().on(t.slug, t.userId), pg.index().on(t.isPublic, t.slug, t.userId)],
);

export const resumeStatistics = pg.pgTable("resume_statistics", {
	id: pg
		.text("id")
		.notNull()
		.primaryKey()
		.$defaultFn(() => generateId()),
	views: pg.integer("views").notNull().default(0),
	downloads: pg.integer("downloads").notNull().default(0),
	lastViewedAt: pg.timestamp("last_viewed_at"),
	lastDownloadedAt: pg.timestamp("last_downloaded_at"),
	resumeId: pg
		.text("resume_id")
		.unique()
		.notNull()
		.references(() => resume.id, { onDelete: "cascade" }),
	createdAt: pg.timestamp("created_at").notNull().defaultNow(),
	updatedAt: pg
		.timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date()),
});

export const apikey = pg.pgTable("apikey", {
	id: pg
		.text("id")
		.notNull()
		.primaryKey()
		.$defaultFn(() => generateId()),
	name: pg.text("name"),
	start: pg.text("start"),
	prefix: pg.text("prefix"),
	key: pg.text("key").notNull(),
	userId: pg
		.text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	refillInterval: pg.integer("refill_interval"),
	refillAmount: pg.integer("refill_amount"),
	lastRefillAt: pg.timestamp("last_refill_at"),
	enabled: pg.boolean("enabled").notNull().default(true),
	rateLimitEnabled: pg.boolean("rate_limit_enabled").notNull().default(false),
	rateLimitTimeWindow: pg.integer("rate_limit_time_window"),
	rateLimitMax: pg.integer("rate_limit_max"),
	requestCount: pg.integer("request_count").notNull().default(0),
	remaining: pg.integer("remaining"),
	lastRequest: pg.timestamp("last_request"),
	expiresAt: pg.timestamp("expires_at"),
	createdAt: pg.timestamp("created_at").notNull().defaultNow(),
	updatedAt: pg
		.timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date()),
	permissions: pg.text("permissions"),
	metadata: pg.jsonb("metadata"),
});
