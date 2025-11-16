import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";
import { sql } from "drizzle-orm";
import { db } from "@/integrations/drizzle/client";
import { getStorageService } from "@/integrations/orpc/services/storage";

function isUnhealthy(check: unknown): boolean {
	return (
		!!check &&
		typeof check === "object" &&
		"status" in check &&
		typeof check.status === "string" &&
		check.status === "unhealthy"
	);
}

async function handler(_: { request: Request }) {
	const checks = {
		version: process.env.npm_package_version,
		status: "healthy",
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
		memory: process.memoryUsage(),
		database: await checkDatabase(),
		storage: await checkStorage(),
	};

	if (checks.status === "unhealthy" || Object.values(checks).some(isUnhealthy)) {
		return json(checks, { status: 500 });
	}

	return json(checks, { status: 200 });
}

async function checkDatabase() {
	try {
		await db.execute(sql`SELECT 1`);

		return { status: "healthy" };
	} catch (error) {
		return { status: "unhealthy", error: error instanceof Error ? error.message : "Unknown error" };
	}
}

async function checkStorage() {
	try {
		const storageService = getStorageService();
		const result = await storageService.healthCheck();

		return result;
	} catch (error) {
		return {
			status: "unhealthy",
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

export const Route = createFileRoute("/api/health")({
	server: {
		handlers: {
			GET: handler,
		},
	},
});
