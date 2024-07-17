import * as fs from "node:fs/promises";

// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = false;

/**
 * @typedef Event
 * @property {string} start
 * @property {string} end
 * @property {string} description
 * @property {"" | "1" | "2" | "3"} medal
 * @property {{ code: string, description: string }} discipline
 * @property {{ code: string, description: string }} venue
 * @property {{ } | { team1: { code: string, description: string }, team2: { code: string, description: string } }} [match]
 */

export async function load() {
	let text = await fs.readFile(new URL("data.json", import.meta.url), "utf8")
	let events = /** @type {Array<Event>} */(JSON.parse(text));
	return { events }
}
