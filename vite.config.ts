import { lingui } from "@lingui/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import mdx from "fumadocs-mdx/vite";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import * as docsConfig from "./source.config";

const config = defineConfig({
	define: {
		__APP_VERSION__: JSON.stringify(process.env.npm_package_version),
	},

	build: {
		chunkSizeWarningLimit: 10 * 1024, // 10mb
	},

	server: {
		host: true,
		port: 3000,
		strictPort: true,
		allowedHosts: true,
		hmr: {
			host: "localhost",
			port: 3000,
		},
	},

	plugins: [
		tsconfigPaths(),
		tailwindcss(),
		tanstackStart({ router: { semicolons: true, quoteStyle: "double" } }),
		viteReact({ babel: { plugins: [["@lingui/babel-plugin-lingui-macro"]] } }),
		nitro({ plugins: ["plugins/migrate.ts"] }),
		lingui(),
		mdx(docsConfig),
	],
});

export default config;
