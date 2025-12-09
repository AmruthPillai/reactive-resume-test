import { ORPCError, os } from "@orpc/server";
import type { RequestHeadersPluginContext } from "@orpc/server/plugins";
import { env } from "@/utils/env";
import type { Locale } from "@/utils/locale";
import { auth } from "../auth/config";
import type { AuthSession } from "../auth/types";

interface ORPCContext extends RequestHeadersPluginContext {
	locale: Locale;
}

async function getSession(context: ORPCContext): Promise<AuthSession | null> {
	try {
		const headers = context.reqHeaders ?? new Headers();
		const result = await auth.api.getSession({ headers });

		return result;
	} catch {
		return null;
	}
}

const base = os.$context<ORPCContext>();

export const publicProcedure = base.use(async ({ context, next }) => {
	const session = await getSession(context);

	return next({
		context: {
			...context,
			user: session?.user ?? null,
			session: session?.session ?? null,
		},
	});
});

export const protectedProcedure = publicProcedure.use(async ({ context, next }) => {
	if (!context.user || !context.session) throw new ORPCError("UNAUTHORIZED");

	return next({
		context: {
			...context,
			user: context.user,
			session: context.session,
		},
	});
});

/**
 * Server-only procedure that can only be called from server-side code (e.g., loaders).
 * Rejects requests from the browser with a 401 UNAUTHORIZED error.
 */
export const serverOnlyProcedure = publicProcedure.use(async ({ context, next }) => {
	const headers = context.reqHeaders ?? new Headers();

	// Check for the custom header that indicates this is a server-side call
	// Server-side calls using createRouterClient have this header set
	const isServerSideCall = env.FLAG_DEBUG_PRINTER || headers.get("x-server-side-call") === "true";

	// If the header is not present, this is a client-side HTTP request - reject it
	if (!isServerSideCall) {
		throw new ORPCError("UNAUTHORIZED", {
			message: "This endpoint can only be called from server-side code",
		});
	}

	return next({ context });
});
