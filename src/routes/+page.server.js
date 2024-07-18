import data from "../../static/data.json";
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
	return { events: data }
}
