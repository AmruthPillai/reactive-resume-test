import path from "node:path";
import { createFileRoute } from "@tanstack/react-router";
import { env } from "@/utils/env";

export const Route = createFileRoute("/uploads/$userId/$fileId")({
	server: {
		handlers: {
			GET: handler,
		},
	},
});

async function handler({ request }: { request: Request }) {
	const [userId, fileId] = new URL(request.url).pathname.replace("/uploads/", "").split("/");

	if (!userId || !fileId) {
		return new Response("Bad Request", { status: 400 });
	}

	// Validate path to prevent directory traversal
	const normalizedUserId = path.normalize(userId).replace(/^(\.\.(\/|\\|$))+/, "");
	const normalizedFileId = path.normalize(fileId).replace(/^(\.\.(\/|\\|$))+/, "");

	if (normalizedUserId !== userId || normalizedFileId !== fileId) {
		return new Response("Forbidden", { status: 403 });
	}

	const file = Bun.file(`./data/uploads/${userId}/${fileId}`);

	if (!(await file.exists())) {
		return new Response("Not Found", { status: 404 });
	}

	// Determine content type based on file extension
	const ext = path.extname(fileId).toLowerCase();
	const contentTypes: Record<string, string> = {
		".webp": "image/webp",
		".jpg": "image/jpeg",
		".jpeg": "image/jpeg",
		".png": "image/png",
		".gif": "image/gif",
		".svg": "image/svg+xml",
		".pdf": "application/pdf",
	};

	const contentType = contentTypes[ext] || "application/octet-stream";

	// Check for conditional requests (ETags)
	const fileStats = await file.stat();
	const etag = `"${fileStats.size}-${fileStats.mtime.getTime()}"`;
	const ifNoneMatch = request.headers.get("If-None-Match");

	if (ifNoneMatch === etag) {
		return new Response(null, {
			status: 304,
			headers: {
				ETag: etag,
				"Cache-Control": "public, max-age=31536000, immutable",
			},
		});
	}

	// Determine if file should be forced to download
	const dangerousTypes = [".html", ".svg", ".xml", ".js"];
	const shouldForceDownload = dangerousTypes.includes(ext);

	const headers = new Headers({
		// Content headers
		"Content-Type": shouldForceDownload ? "application/octet-stream" : contentType,
		"Content-Length": fileStats.size.toString(),

		// Force download for dangerous types
		...(shouldForceDownload && {
			"Content-Disposition": `attachment; filename="${path.basename(fileId)}"`,
		}),

		// Caching headers (1 year for immutable user uploads)
		"Cache-Control": "public, max-age=31536000, immutable",
		ETag: etag,

		// Security headers
		"X-Content-Type-Options": "nosniff", // Prevent MIME sniffing
		"X-Robots-Tag": "noindex, nofollow", // Prevent search engine indexing
		"Cross-Origin-Resource-Policy": "same-site", // Prevent embedding from other origins
		"Referrer-Policy": "strict-origin-when-cross-origin", // Control referrer information

		// CSP for extra protection (especially for SVGs)
		"Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox;",

		// Prevent browsers from opening files directly
		"X-Frame-Options": "DENY", // Prevent embedding in iframes
		"X-Download-Options": "noopen", // IE-specific: prevent opening directly

		// CORS (adjust based on your needs)
		"Access-Control-Allow-Origin": env.APP_URL,
	});

	return new Response(await file.arrayBuffer(), { headers });
}
