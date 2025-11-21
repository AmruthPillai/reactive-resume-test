import _slugify from "@sindresorhus/slugify";
import { adjectives, animals, colors, uniqueNamesGenerator } from "unique-names-generator";
import { v7 as uuidv7 } from "uuid";

/**
 * Generates a unique ID using the UUIDv7 algorithm.
 * @returns The generated ID.
 */
export function generateId() {
	return uuidv7();
}

/** Slugifies a string, with some pre-defined options.
 *
 * @param value - The value to slugify.
 * @returns The slugified value.
 */
export function slugify(value: string) {
	return _slugify(value, { decamelize: false });
}

/**
 * Generates initials from a name.
 * @param name - The name to generate initials from.
 * @returns The initials.
 */
export function getInitials(name: string) {
	return name
		.split(" ")
		.map((n) => n[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();
}

/**
 * Transforms a string to a valid username (lowercase, no special characters except for dots, hyphens and underscores).
 * @param value - The value to transform.
 * @returns The transformed username.
 */
export function toUsername(value: string) {
	return value
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9._-]/g, "")
		.slice(0, 64);
}

/**
 * Generates a random name using the unique-names-generator library.
 * @returns The random name.
 */
export function generateRandomName() {
	return uniqueNamesGenerator({
		dictionaries: [adjectives, colors, animals],
		style: "capital",
		separator: " ",
		length: 3,
	});
}

/**
 * Checks if a string is a valid URL.
 * The string may or may not include the protocol (http:// or https://).
 * If it doesn't, it will be prefixed with https://.
 * If the string is empty, or is not a valid URL, it will return false.
 * @param value - The value to check.
 * @returns True if the value is a valid URL, false otherwise.
 */
export function isValidUrl(value: string): false | string {
	let url = value;

	if (url === "") return false;

	if (!url.startsWith("http://") && !url.startsWith("https://")) {
		url = `https://${url}`;
	}

	try {
		const urlObject = new URL(url);
		return urlObject.toString();
	} catch {
		return false;
	}
}
