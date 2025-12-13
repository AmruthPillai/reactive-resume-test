import { join } from "node:path";

const GITHUB_API_URL = "https://api.github.com/repos/AmruthPillai/Reactive-Resume";
const GITHUB_STARS_CACHE_FILE = join(process.cwd(), "data", "github", "stars.txt");
const CACHE_DURATION_MS = 6 * 60 * 60 * 1000; // 6 hours
const LAST_KNOWN_STARS_COUNT = 34_073;

/**
 * Reads and validates cached star count.
 */
const readStarCountFromCache = async (): Promise<number | null> => {
	const file = Bun.file(GITHUB_STARS_CACHE_FILE);

	if (!(await file.exists())) return null;

	const [stats, contents] = await Promise.all([file.stat(), file.text()]);
	if (stats.mtimeMs < Date.now() - CACHE_DURATION_MS) return null;

	const num = Number.parseInt(contents, 10);
	return Number.isFinite(num) && num > 0 ? num : null;
};

/**
 * Writes the star count to cache as string, fire-and-forget with minimal error handling.
 */
const writeStarCountToCache = (count: number) => {
	void Bun.write(GITHUB_STARS_CACHE_FILE, String(count));
};

export const githubService = {
	getStarCount: async (): Promise<number> => {
		// Try cache first
		const cached = await readStarCountFromCache();
		if (cached !== null) return cached;

		let stars = LAST_KNOWN_STARS_COUNT;

		// Fallback to API if cache is stale
		try {
			const response = await fetch(GITHUB_API_URL, { headers: { Accept: "application/vnd.github+json" } });

			if (response.ok) {
				const data = await response.json();
				const apiStars = Number(data.stargazers_count);
				if (Number.isFinite(apiStars) && apiStars > 0) {
					stars = apiStars;
					writeStarCountToCache(apiStars);
				}
			}
		} catch {
			// Ignore errors, use last known count
		}

		return stars;
	},
};
