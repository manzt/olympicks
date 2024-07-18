/** @import { type EventGroupData } from "$lib/state.svelte.js" */
import data from "../../static/data.json";
import * as schema from "$lib/schema.js";

export const prerender = true;

export async function load() {
  let events = schema.eventSchema.array().parse(data);
  let byMonthDay = Map.groupBy(events, (item) => item.start.split("T")[0]);

  /** @type {Record<string, Array<EventGroupData>>} */
  let byMonthDayAndDiscipline = {};

  for (let [monthDayString, items] of byMonthDay) {
    // Group by discipline short name.
    let grp = Map.groupBy(items, ({ discipline }) => discipline.shortName);
    byMonthDayAndDiscipline[monthDayString] = Array
      .from(grp.entries())
      .map(([shortName, events]) => ({
        // Just grab the label from the first event.
        // We know there has to be at least one event
        // in the group (for the grouping to exist).
        label: { name: events[0].discipline.name, shortName: shortName },
        events: events.toSorted(sortEvents),
        open: false,
      }));
  }

  return {
    totalEvents: events.length,
    sections: Object.entries(byMonthDayAndDiscipline)
      .toSorted(([a], [b]) => a.localeCompare(b))
      .map(([date, items]) => ({ name: stringifyMonthDay(date), items })),
  };
}

/** @param {string} str */
function stringifyMonthDay(str) {
  return new Date(str).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
}

/**
 * A custom sort function for events.
 *
 * 1.) Sort by start date.
 * 2.) If the start dates are the same, sort by description (i.e., the event name)
 *
 * @param {schema.Event} a
 * @param {schema.Event} b
 * @returns {number}
 */
function sortEvents(a, b) {
  let cmp = a.start.localeCompare(b.start);
  return cmp === 0 ? a.description.localeCompare(b.description) : cmp;
}

