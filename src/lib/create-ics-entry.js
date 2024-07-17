// @ts-check
import * as ics from "ics";

/** @typedef {import('../routes/+page.server.js').Event} Event */

/**
 * @param {string} isoString
 * @returns {[number, number, number, number, number]}
 */
function convertToIcsDate(isoString) {
	let date = new Date(isoString);
	return [
		date.getUTCFullYear(),
		date.getUTCMonth() + 1, // getMonth() returns 0-11
		date.getUTCDate(),
		date.getUTCHours(),
		date.getUTCMinutes(),
	];
}

/**
 * @param {Array<Event>} events
 * @returns {string}
 */
export function createIcsEntry(events) {
	console.log(events)
	let result = ics.createEvents(events.map((event) => ({
		title: event.discipline.description,
		description: event.description,
		start: convertToIcsDate(event.start),
		end: convertToIcsDate(event.end),
		startInputType: "utc",
		startOutputType: "utc",
		endInputType: "utc",
		endOutputType: "utc",
	})));
	if (result.error) {
		throw result.error;
	}
	// @ts-expect-error ics typings are wrong
	return result.value;
}
