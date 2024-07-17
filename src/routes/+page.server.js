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
	/** @type {Record<string, Array<{ code: string, events: Array<SelectedEvent> }>>} */
	let byDayAndDisipline = {}
	/** @type {Map<string, string>} */
	let lookup = new Map();
	for (let [day, items] of byDay) {
		let grp = Object.groupBy(items, ({ discipline }) => {
			lookup.set(discipline.code, discipline.description);
			return discipline.code;
		});
		// @ts-expect-error - It thinks it's undefined
		byDayAndDisipline[day] = Object
			.entries(grp)
			.map(([discipline, events]) => ({ code: discipline, events }));
	}
	return {
		days: Object
			.entries(byDayAndDisipline)
			.toSorted(([a], [b]) => a.localeCompare(b))
			.map(([date, disciplines]) => ({ date, disciplines })),
		lookup,
	}
}
