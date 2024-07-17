import * as fs from "node:fs/promises";

// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = true;

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

/** @typedef {Event & { checked: boolean }} SelectedEvent */

export async function load() {
	let text = await fs.readFile(new URL("data.json", import.meta.url), "utf8")
	/** @type {Array<Event>} */
	let json = JSON.parse(text)
	let data = json.map(d => ({ ...d, checked: true }));
	let byDay = Map.groupBy(data, (item) => item.start.split("T")[0])
	/** @type {Map<string, Map<string, Array<SelectedEvent>>>} */
	let byDayAndDisipline = new Map()
	/** @type {Map<string, string>} */
	let lookup = new Map();
	for (let [day, items] of byDay) {
		byDayAndDisipline.set(day, Map.groupBy(items, (item) => {
			lookup.set(item.discipline.code, item.discipline.description);
			return item.discipline.code;
		}))
	}
	return {
		days: Array.from(byDayAndDisipline).toSorted(([a], [b]) => a.localeCompare(b)),
		lookup,
	}
}
