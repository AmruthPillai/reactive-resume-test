import type { auth } from "./config";

export type AuthSession = typeof auth.$Infer.Session;

export type AuthProvider = "credential" | "google" | "github" | "custom";
