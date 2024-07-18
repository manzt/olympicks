export const prerender = true;

/**
 * @typedef Event
 * @property {string} start
 * @property {string} end
 * @property {string} description
 * @property {"" | "1" | "2" | "3"} medal
 * @property {{ code: string, description: string }} discipline
 * @property {{ } | { team1: { code: string, description: string }, team2: { code: string, description: string } }} [match]
 */

export async function load() {
	let response = await fetch(new URL("data.json", import.meta.url))
	let text = await response.text();
	let events = /** @type {Array<Event>} */(JSON.parse(text));
	return { events }
}
