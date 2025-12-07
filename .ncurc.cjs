// @ts-check

/** @type {import('npm-check-updates').RunOptions} */
module.exports = {
	upgrade: true,
	install: "always",
	packageManager: "bun",
	reject: [
		"@tanstack/react-query", // orpc needs @tanstack/react-query@5.90.7
	],
};
