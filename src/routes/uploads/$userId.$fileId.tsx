import { createHash } from "node:crypto";
import path from "node:path";
import { createFileRoute } from "@tanstack/react-router";
import { buildStorageKey, getStorageService, inferContentType } from "@/integrations/storage";
import { env } from "@/utils/env";

const storageService = getStorageService();

export const Route = createFileRoute("/uploads/$userId/$fileId")({
	server: { handlers: { GET: handler } },
});

/**
 * Handler for GET requests to serve uploaded files, supporting ETags, content security, and path validation.
 */
async function handler({ request }: { request: Request }) {
	const { userId, fileId } = parseRouteParams(request.url);

	if (!userId || !fileId) return new Response("Bad Request", { status: 400 });

	if (!isValidPath(userId) || !isValidPath(fileId)) return new Response("Forbidden", { status: 403 });

	const key = buildStorageKey(userId, fileId);
	const storedFile = await storageService.read(key);

	if (!storedFile) return new Response("Not Found", { status: 404 });

	const ext = path.extname(fileId).toLowerCase();
	const contentType = storedFile.contentType ?? inferContentType(fileId);
	const etag = createEtag(storedFile);

	if (isNotModified(request.headers, etag)) return makeNotModifiedResponse(etag);

	const shouldForceDownload = [".html", ".svg", ".xml", ".js"].includes(ext);
	const headers = buildResponseHeaders({
		fileId,
		storedFile,
		contentType,
		etag,
		shouldForceDownload,
	});

	const buffer = toArrayBuffer(storedFile.data);

	return new Response(buffer, { headers });
}

/**
 * Extracts userId and fileId from the request URL.
 */
function parseRouteParams(url: string): { userId: string | undefined; fileId: string | undefined } {
	const [userId, fileId] = new URL(url).pathname.replace("/uploads/", "").split("/");

	return { userId, fileId };
}

/**
 * Validates that a path segment does not contain directory traversal attempts.
 */
function isValidPath(segment: string): boolean {
	const normalized = path.normalize(segment).replace(/^(\.\.(\/|\\|$))+/, "");

	return normalized === segment;
}

/**
 * Checks for ETag match for conditional GET requests.
 */
function isNotModified(headers: Headers, etag: string): boolean {
	const ifNoneMatch = headers.get("If-None-Match");
	const candidates = ifNoneMatch?.split(",").map((s) => s.trim()) ?? [];

	return candidates.includes(etag);
}

/**
 * Returns a 304 Not Modified response with caching headers.
 */
function makeNotModifiedResponse(etag: string): Response {
	return new Response(null, {
		status: 304,
		headers: { ETag: etag, "Cache-Control": "public, max-age=31536000, immutable" },
	});
}

type BuildResponseHeaderArgs = {
	fileId: string;
	storedFile: { size: number };
	contentType: string;
	etag: string;
	shouldForceDownload: boolean;
};

/**
 * Builds all headers for serving the file, including caching, security, and download headers.
 */
function buildResponseHeaders({
	fileId,
	storedFile,
	contentType,
	etag,
	shouldForceDownload,
}: BuildResponseHeaderArgs): Headers {
	const headers = new Headers();

	headers.set("Content-Type", shouldForceDownload ? "application/octet-stream" : contentType);
	headers.set("Content-Length", storedFile.size.toString());

	if (shouldForceDownload) {
		headers.set("Content-Disposition", `attachment; filename="${path.basename(fileId)}"`);
	}

	headers.set("Cache-Control", "public, max-age=31536000, immutable");
	headers.set("ETag", etag);

	// Security Headers
	headers.set("X-Content-Type-Options", "nosniff");
	headers.set("X-Robots-Tag", "noindex, nofollow");
	headers.set("Cross-Origin-Resource-Policy", "same-site");
	headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
	headers.set("Content-Security-Policy", "default-src 'none'; style-src 'unsafe-inline'; sandbox;");
	headers.set("X-Frame-Options", "DENY");
	headers.set("X-Download-Options", "noopen");
	headers.set("Access-Control-Allow-Origin", env.APP_URL);

	return headers;
}

/**
 * Converts a Uint8Array to ArrayBuffer efficiently.
 */
function toArrayBuffer(data: Uint8Array): ArrayBuffer {
	return data.byteOffset === 0 && data.byteLength === data.buffer.byteLength
		? (data.buffer as ArrayBuffer)
		: (data.slice().buffer as ArrayBuffer);
}

/**
 * Generates or returns the ETag for a stored file.
 */
function createEtag(storedFile: { data: Uint8Array; size: number; etag?: string }): string {
	if (storedFile.etag) {
		const tag = storedFile.etag.trim();

		if (tag.startsWith("W/") || tag.startsWith('"')) {
			return tag;
		}
		return `"${tag}"`;
	}

	const hash = createHash("sha1").update(storedFile.data).digest("hex");

	return `"${storedFile.size}-${hash}"`;
}
