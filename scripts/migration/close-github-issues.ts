/**
 * Bun script to close all open issues in a GitHub repository
 * with a comment linking to another issue.
 *
 * Usage:
 *   GITHUB_TOKEN=your_token bun run close-github-issues.ts
 *
 * Environment variables:
 *   GITHUB_TOKEN - Your GitHub personal access token (required)
 *
 * Configuration:
 *   Edit the CONFIG object below to set your repository and message details.
 */

const CONFIG = {
	owner: "AmruthPillai", // GitHub username or organization
	repo: "Reactive-Resume", // Repository name
	targetIssueNumber: 2499, // The issue number to link to in the closing comment
	message:
		"Closing this issue as I'm doing some clean up to move to a newer version of the project. I apologize in advance for the inconvenience if you find the need to reopen this issue.", // Additional message to include

	/**
	 * GitHub's REST API v3 rate limit is 5000 requests per hour (~83 requests/minute) for authenticated requests.
	 * To be extra safe and never exceed 900 points/minute (as per this script's purpose),
	 * we enforce a minimum delay so that, even with max points per endpoint (e.g. some endpoints cost 1, some more),
	 * we don't exceed 900/min for any single REST endpoint.
	 *
	 * If you want to guarantee under 900 points/min,
	 * set maxParallel = 1 and delay between each request at least 67ms (900 req/min = 1 req/66.6ms).
	 * To err on the side of caution (allow for retries/variance), use a more conservative delay.
	 */
	minDelayMs: 100, // 100ms ensures max 600 requests/minute (well under 900 points). Adjust higher for more margin.
	maxDelayMs: 200, // 200ms = 300 reqs/min if doing the min delay;
	dryRun: false, // Set to false to actually close issues
};

interface GitHubIssue {
	number: number;
	title: string;
	html_url: string;
	pull_request?: object;
}

interface GitHubError {
	message: string;
	documentation_url?: string;
}

const GITHUB_API_BASE = "https://api.github.com";

function getRandomDelay(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function githubRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
	const token = process.env.GITHUB_TOKEN;

	if (!token) {
		throw new Error(
			"GITHUB_TOKEN environment variable is required. " +
				"Create a token at https://github.com/settings/tokens with 'repo' scope.",
		);
	}

	const url = `${GITHUB_API_BASE}${endpoint}`;
	const response = await fetch(url, {
		...options,
		headers: {
			Accept: "application/vnd.github.v3+json",
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
			"X-GitHub-Api-Version": "2022-11-28",
			...options.headers,
		},
	});

	// Check for rate limiting
	const rateLimitRemaining = response.headers.get("x-ratelimit-remaining");
	const rateLimitReset = response.headers.get("x-ratelimit-reset");

	if (rateLimitRemaining) {
		console.log(`  Rate limit remaining: ${rateLimitRemaining}`);
	}

	if (response.status === 403 && rateLimitRemaining === "0") {
		const resetTime = rateLimitReset ? new Date(Number.parseInt(rateLimitReset, 10) * 1000) : new Date();
		throw new Error(`Rate limited. Resets at ${resetTime.toISOString()}`);
	}

	if (!response.ok) {
		const error = (await response.json()) as GitHubError;
		throw new Error(`GitHub API error: ${error.message} (${response.status})`);
	}

	return response.json() as Promise<T>;
}

async function fetchAllOpenIssues(): Promise<GitHubIssue[]> {
	const { owner, repo } = CONFIG;
	const allIssues: GitHubIssue[] = [];
	let page = 1;
	const perPage = 100;

	console.log(`\nFetching open issues from ${owner}/${repo}...`);

	while (true) {
		const endpoint = `/repos/${owner}/${repo}/issues?state=open&per_page=${perPage}&page=${page}`;
		const issues = await githubRequest<GitHubIssue[]>(endpoint);

		// Filter out pull requests (GitHub API returns PRs as issues)
		const actualIssues = issues.filter((issue) => !issue.pull_request);
		allIssues.push(...actualIssues);

		console.log(`  Page ${page}: fetched ${issues.length} items (${actualIssues.length} issues)`);

		if (issues.length < perPage) {
			break;
		}

		page++;

		// Add delay between pagination requests
		const delay = getRandomDelay(CONFIG.minDelayMs, CONFIG.maxDelayMs);
		console.log(`  Waiting ${delay}ms before next page...`);
		await sleep(delay);
	}

	return allIssues;
}

async function addCommentToIssue(issueNumber: number): Promise<void> {
	const { owner, repo, targetIssueNumber, message } = CONFIG;
	const endpoint = `/repos/${owner}/${repo}/issues/${issueNumber}/comments`;

	const commentBody = `${message}\n\nPlease read #${targetIssueNumber} for more information about the migration.`;

	await githubRequest(endpoint, {
		method: "POST",
		body: JSON.stringify({ body: commentBody }),
	});
}

async function closeIssue(issueNumber: number): Promise<void> {
	const { owner, repo } = CONFIG;
	const endpoint = `/repos/${owner}/${repo}/issues/${issueNumber}`;

	await githubRequest(endpoint, {
		method: "PATCH",
		body: JSON.stringify({ state: "closed", state_reason: "not_planned" }),
	});
}

async function processIssue(issue: GitHubIssue): Promise<void> {
	const { dryRun, targetIssueNumber } = CONFIG;

	// Skip the target issue itself
	if (issue.number === targetIssueNumber) {
		console.log(`  Skipping #${issue.number} (target issue)`);
		return;
	}

	console.log(`\nProcessing issue #${issue.number}: ${issue.title}`);
	console.log(`  URL: ${issue.html_url}`);

	if (dryRun) {
		console.log("  [DRY RUN] Would add comment and close issue");
		return;
	}

	// Add comment
	console.log("  Adding comment...");
	await addCommentToIssue(issue.number);

	// Random delay between comment and close
	const midDelay = getRandomDelay(500, 1500);
	await sleep(midDelay);

	// Close issue
	console.log("  Closing issue...");
	await closeIssue(issue.number);

	console.log("  Done!");
}

async function main(): Promise<void> {
	console.log("GitHub Issue Closer");
	console.log("===================");
	console.log(`Repository: ${CONFIG.owner}/${CONFIG.repo}`);
	console.log(`Target issue: #${CONFIG.targetIssueNumber}`);
	console.log(`Dry run: ${CONFIG.dryRun}`);

	if (CONFIG.dryRun) {
		console.log("\n⚠️  Running in DRY RUN mode. No issues will be modified.");
		console.log("   Set CONFIG.dryRun = false to actually close issues.\n");
	}

	try {
		const issues = await fetchAllOpenIssues();

		console.log(`\nFound ${issues.length} open issues`);

		if (issues.length === 0) {
			console.log("No issues to process.");
			return;
		}

		// Filter out the target issue from processing
		const issuesToProcess = issues.filter((i) => i.number !== CONFIG.targetIssueNumber);

		console.log(`Will process ${issuesToProcess.length} issues`);

		let processed = 0;
		let errors = 0;

		for (const issue of issuesToProcess) {
			try {
				await processIssue(issue);
				processed++;

				// Random delay between issues
				if (!CONFIG.dryRun && issuesToProcess.indexOf(issue) < issuesToProcess.length - 1) {
					const delay = getRandomDelay(CONFIG.minDelayMs, CONFIG.maxDelayMs);
					console.log(`  Waiting ${delay}ms before next issue...`);
					await sleep(delay);
				}
			} catch (error) {
				errors++;
				console.error(`  Error processing #${issue.number}:`, error instanceof Error ? error.message : error);

				// Longer delay after an error (might be rate limiting)
				const errorDelay = getRandomDelay(5000, 10000);
				console.log(`  Waiting ${errorDelay}ms after error...`);
				await sleep(errorDelay);
			}
		}

		console.log("\n===================");
		console.log("Summary:");
		console.log(`  Processed: ${processed}`);
		console.log(`  Errors: ${errors}`);

		if (CONFIG.dryRun) {
			console.log("\n✅ Dry run complete. Set CONFIG.dryRun = false to close issues.");
		} else {
			console.log("\n✅ All issues processed.");
		}
	} catch (error) {
		console.error("\nFatal error:", error instanceof Error ? error.message : error);
		process.exit(1);
	}
}

if (import.meta.main) {
	main().catch((error) => {
		console.error(error);
		process.exit(1);
	});
}
