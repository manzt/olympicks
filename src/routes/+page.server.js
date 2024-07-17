import * as fs from "node:fs/promises";

// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = false;

/**
 * @typedef Event
 * @property {string} id
 * @property {string} start
 * @property {string} end
 * @property {string} description
 * @property {"" | "1" | "2" | "3"} medal
 * @property {{ code: string, description: string }} discipline
 * @property {{ code: string, description: string }} venue
 * @property {{ } | { team1: { code: string, description: string }, team2: { code: string, description: string } }} [match]
 */


export async function load() {
	/** @type {Record<string, number>} */
	let counts = {}
	/** @param {Event} evt */
	function idFor(evt) {
		// need to make a unique id
		counts[evt.discipline.code] = (counts[evt.discipline.code] || 0) + 1;
		return `${evt.discipline.code}${counts[evt.discipline.code]}`
	}

	let text = await fs.readFile(new URL("data.json", import.meta.url), "utf8")
	let data = /** @type {Array<Event>} */(JSON.parse(text)).map((item) => ({ ...item, id: idFor(item) }));
	let byDay = Map.groupBy(data, (item) => item.start.split("T")[0])
	/** @type {Record<string, Array<{ code: string, events: Array<Event> }>>} */
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
