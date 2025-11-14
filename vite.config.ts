import { lingui } from "@lingui/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const config = defineConfig({
	define: {
		__APP_VERSION__: JSON.stringify(process.env.npm_package_version),
	},

	build: {
		chunkSizeWarningLimit: 10 * 1024, // 10mb
	},

	plugins: [
		tsconfigPaths(),
		tailwindcss(),
		tanstackStart({ router: { semicolons: true, quoteStyle: "double" } }),
		viteReact({ babel: { plugins: [["@lingui/babel-plugin-lingui-macro"]] } }),
		process.env.NO_NITRO ? undefined : nitro(),
		lingui(),
	],
});

export default config;
