import {
	genericOAuthClient,
	inferAdditionalFields,
	passkeyClient,
	twoFactorClient,
	usernameClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "./config";

export const authClient = createAuthClient({
	plugins: [
		usernameClient(),
		twoFactorClient({
			onTwoFactorRedirect() {
				// Redirect to 2FA verification page
				if (typeof window !== "undefined") {
					window.location.href = "/auth/verify-2fa";
				}
			},
		}),
		passkeyClient(),
		genericOAuthClient(),
		inferAdditionalFields<typeof auth>(),
	],
});
