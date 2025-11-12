import type { auth } from "./config";

export type Session = typeof auth.$Infer.Session;

export type AuthProvider = "credential" | "google" | "github" | "custom";
