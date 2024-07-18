import * as schema from "$lib/schema.ts";
import data from "../../static/data.json";

export const prerender = true;

export async function load() {
	let events = schema.eventSchema.array().parse(data);
	return { events };
}
