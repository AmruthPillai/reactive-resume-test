import { passkey } from "@better-auth/passkey";
import { BetterAuthError, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { type GenericOAuthConfig, genericOAuth, twoFactor } from "better-auth/plugins";
import { username } from "better-auth/plugins/username";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { db } from "@/integrations/drizzle/client";
import { env } from "@/utils/env";
import { generateId, toUsername } from "@/utils/string";
import { schema } from "../drizzle";

function isCustomOAuthProviderEnabled() {
	return (
		env.OAUTH_CLIENT_ID &&
		env.OAUTH_CLIENT_SECRET &&
		env.OAUTH_DISCOVERY_URL &&
		env.OAUTH_AUTHORIZATION_URL &&
		env.OAUTH_REDIRECT_URI
	);
}

const getAuthConfig = () => {
	const authConfigs: GenericOAuthConfig[] = [];

	if (isCustomOAuthProviderEnabled()) {
		authConfigs.push({
			providerId: "custom",
			clientId: env.OAUTH_CLIENT_ID as string,
			clientSecret: env.OAUTH_CLIENT_SECRET,
			discoveryUrl: env.OAUTH_DISCOVERY_URL,
			authorizationUrl: env.OAUTH_AUTHORIZATION_URL,
			redirectURI: env.OAUTH_REDIRECT_URI,
			mapProfileToUser: async (profile) => {
				if (!profile.email) {
					throw new BetterAuthError(
						"OAuth Provider did not return an email address. This is required for user creation.",
						"EMAIL_REQUIRED",
					);
				}

				const email = profile.email;
				const name = profile.name ?? profile.preferred_username ?? email.split("@")[0];
				const username = profile.preferred_username ?? email.split("@")[0];
				const image = profile.image ?? profile.picture ?? profile.avatar_url;

				return {
					name,
					email,
					image,
					username,
					displayUsername: username,
					emailVerified: true,
				};
			},
		} satisfies GenericOAuthConfig);
	}

	return betterAuth({
		appName: "Reactive Resume",
		secret: env.AUTH_SECRET,

		database: drizzleAdapter(db, { schema, provider: "pg" }),

		telemetry: { enabled: false },
		advanced: {
			database: { generateId },
			useSecureCookies: env.APP_URL.startsWith("https://"),
		},

		emailAndPassword: {
			enabled: true,
			autoSignIn: true,
			minPasswordLength: 6,
			maxPasswordLength: 64,
			requireEmailVerification: false,
			disableSignUp: env.FLAG_DISABLE_SIGNUP,
			sendResetPassword: async ({ user, url }) => {
				console.log(`[EMAIL] [${user.email}] To reset your password, please visit the following URL: ${url}`);
			},
			password: {
				hash: (password) => Bun.password.hash(password),
				verify: ({ password, hash }) => Bun.password.verify(password, hash),
			},
		},

		emailVerification: {
			sendOnSignUp: true,
			autoSignInAfterVerification: true,
			sendVerificationEmail: async ({ user, url }) => {
				console.log(`[EMAIL] [${user.email}] To verify your email, please visit the following URL: ${url}`);
			},
		},

		user: {
			changeEmail: {
				enabled: true,
				sendChangeEmailVerification: async ({ user, newEmail, url }) => {
					console.log(
						`[EMAIL] [${user.email}] To change your email to ${newEmail}, please visit the following URL: ${url}`,
					);
				},
			},
			additionalFields: {
				username: {
					type: "string",
					required: true,
				},
			},
		},

		socialProviders: {
			google: {
				enabled: !!env.GOOGLE_CLIENT_ID && !!env.GOOGLE_CLIENT_SECRET,
				// biome-ignore lint/style/noNonNullAssertion: enabled check ensures these are not null
				clientId: env.GOOGLE_CLIENT_ID!,
				// biome-ignore lint/style/noNonNullAssertion: enabled check ensures these are not null
				clientSecret: env.GOOGLE_CLIENT_SECRET!,
				mapProfileToUser: async (profile) => {
					return {
						name: profile.name,
						email: profile.email,
						image: profile.picture,
						username: profile.email.split("@")[0],
						displayUsername: profile.email.split("@")[0],
						emailVerified: true,
					};
				},
			},

			github: {
				enabled: !!env.GITHUB_CLIENT_ID && !!env.GITHUB_CLIENT_SECRET,
				// biome-ignore lint/style/noNonNullAssertion: enabled check ensures these are not null
				clientId: env.GITHUB_CLIENT_ID!,
				// biome-ignore lint/style/noNonNullAssertion: enabled check ensures these are not null
				clientSecret: env.GITHUB_CLIENT_SECRET!,
				mapProfileToUser: async (profile) => {
					return {
						name: profile.name,
						email: profile.email,
						image: profile.avatar_url,
						username: profile.login,
						displayUsername: profile.login,
						emailVerified: true,
					};
				},
			},
		},

		plugins: [
			username({
				minUsernameLength: 3,
				maxUsernameLength: 64,
				usernameNormalization: (value) => toUsername(value),
				displayUsernameNormalization: (value) => toUsername(value),
				validationOrder: { username: "post-normalization", displayUsername: "post-normalization" },
			}),
			twoFactor({ issuer: "Reactive Resume" }),
			passkey({ rpName: "Reactive Resume", rpID: "localhost" }),
			genericOAuth({ config: authConfigs }),
			tanstackStartCookies(),
		],
	});
};

export const auth = getAuthConfig();
