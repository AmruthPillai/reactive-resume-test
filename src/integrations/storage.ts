import { mkdir } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import { env } from "@/utils/env";

export interface StorageWriteInput {
	key: string;
	data: Uint8Array;
	contentType: string;
}

export interface StorageReadResult {
	data: Uint8Array;
	size: number;
	etag?: string;
	lastModified?: Date;
	contentType?: string;
}

export interface StorageService {
	write(input: StorageWriteInput): Promise<void>;
	read(key: string): Promise<StorageReadResult | null>;
	delete(key: string): Promise<boolean>;
}

const CONTENT_TYPE_MAP: Record<string, string> = {
	".webp": "image/webp",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".png": "image/png",
	".gif": "image/gif",
	".svg": "image/svg+xml",
	".pdf": "application/pdf",
};

const DEFAULT_CONTENT_TYPE = "application/octet-stream";

export function buildStorageKey(userId: string, filename: string): string {
	return `uploads/${userId}/${filename}`;
}

export function inferContentType(filename: string): string {
	const extension = extname(filename).toLowerCase();
	return CONTENT_TYPE_MAP[extension] ?? DEFAULT_CONTENT_TYPE;
}

class LocalStorageService implements StorageService {
	constructor(private readonly rootDirectory: string) {}

	async write({ key, data }: StorageWriteInput): Promise<void> {
		const fullPath = this.resolvePath(key);

		await mkdir(dirname(fullPath), { recursive: true });
		await Bun.write(fullPath, data);
	}

	async read(key: string): Promise<StorageReadResult | null> {
		const fullPath = this.resolvePath(key);
		const file = Bun.file(fullPath);

		if (!(await file.exists())) return null;

		const [arrayBuffer, stats] = await Promise.all([file.arrayBuffer(), file.stat()]);

		return {
			data: new Uint8Array(arrayBuffer),
			size: stats.size,
			etag: `"${stats.size}-${stats.mtime.getTime()}"`,
			lastModified: stats.mtime,
			contentType: inferContentType(key),
		};
	}

	async delete(key: string): Promise<boolean> {
		const fullPath = this.resolvePath(key);
		const file = Bun.file(fullPath);

		if (!(await file.exists())) return false;

		await file.delete();
		return true;
	}

	private resolvePath(key: string): string {
		const normalizedKey = key.replace(/^\/*/, "");
		const segments = normalizedKey
			.split(/[/\\]+/)
			.filter((segment) => segment.length > 0 && segment !== "." && segment !== "..");

		if (segments.length === 0) throw new Error("Invalid storage key");

		return join(this.rootDirectory, ...segments);
	}
}

class S3StorageService implements StorageService {
	private readonly client: Bun.S3Client;

	constructor(configuration: Bun.S3Options) {
		this.client = new Bun.S3Client(configuration);
	}

	async write({ key, data, contentType }: StorageWriteInput): Promise<void> {
		await this.client.write(key, data, { type: contentType });
	}

	async read(key: string): Promise<StorageReadResult | null> {
		const exists = await this.client.exists(key);

		if (!exists) return null;

		const [arrayBuffer, stats] = await Promise.all([this.client.file(key).arrayBuffer(), this.client.stat(key)]);

		return {
			data: new Uint8Array(arrayBuffer),
			size: stats.size,
			etag: stats.etag,
			lastModified: stats.lastModified,
			contentType: stats.type ?? inferContentType(key),
		};
	}

	async delete(key: string): Promise<boolean> {
		const exists = await this.client.exists(key);

		if (!exists) return false;

		await this.client.delete(key);

		return true;
	}
}

let cachedService: StorageService | null = null;

export function getStorageService(): StorageService {
	if (cachedService) return cachedService;

	cachedService = createStorageService();
	return cachedService;
}

function createStorageService(): StorageService {
	if (env.S3_ACCESS_KEY_ID && env.S3_SECRET_ACCESS_KEY && env.S3_REGION && env.S3_BUCKET) {
		return new S3StorageService({
			bucket: env.S3_BUCKET,
			region: env.S3_REGION,
			accessKeyId: env.S3_ACCESS_KEY_ID,
			secretAccessKey: env.S3_SECRET_ACCESS_KEY,
			endpoint: env.S3_ENDPOINT,
			sessionToken: env.S3_SESSION_TOKEN,
		});
	}

	return new LocalStorageService(join(process.cwd(), "data"));
}
