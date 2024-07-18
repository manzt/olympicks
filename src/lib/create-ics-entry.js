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
    date.getUTCDate() - 1,
    date.getUTCHours(),
    date.getUTCMinutes(),
  ];
}

/** @param {Array<Event>} group */
function mergeNonMatchEventGroup(group) {
  // Sort by start time
  group.sort((a, b) => a.start.localeCompare(b.start));

  /** @type {Array<Omit<Event, "description"> & { description: Array<string> }>} */
  let merged = [];

  /** @type {Omit<Event, "description"> & { description: Array<string> } | null} */
  let current = null;

  for (let event of group) {
    if (!current) {
      current = { ...event, description: [event.description] };
    } else {
      let currentEnd = new Date(current.end);
      let eventStart = new Date(event.start);

      if (currentEnd >= eventStart) { // overlapping
        // @ts-expect-error - this is ok
        current.end = new Date(Math.max(currentEnd, new Date(event.end)))
          .toISOString();
        current.description.push(event.description);
      } else { // Non-overlapping, push current and reset
        merged.push(current);
        current = { ...event, description: [event.description] };
      }
    }
  }
  if (current) {
    merged.push(current);
  }
  return merged.map((e) => ({
    title: `olympicks: ${e.discipline.description}${formatMedalEvent(e.medal)}`,
    start: e.start,
    end: e.end,
    description: e.description.join("; "),
  }));
}

/**
 * @param {{ team1: { code: string, description: string }, team2: { code: string, description: string } } | {} | undefined} match
 */
function formatMatchEntry(match) {
  if (match && "team1" in match) {
    return ` - ${match.team1.description} vs ${match.team2.description}`;
  }
  return "";
}

/** @param {Event["medal"]} medal */
function formatMedalEvent(medal) {
  return `${medal ? " (medal event)" : ""}`;
}

/**
 * Combines events that are not matches into a single calendar event if they overlap.
 *
 * @param {Event[]} events
 * @returns {Array<{ title: string, description: string, start: string, end: string }>}
 */
function combineEntries(events) {
  // Let's group non-matches together such that they end up as a single calendar
  // event if they overlap.
  let nonMatches = events.filter((event) => !event.match);
  let groups = Map.groupBy(
    nonMatches,
    ({ discipline, start }) => `${start.split("T")[0]}${discipline.code}`,
  );
  let merged = Array
    .from(groups.values())
    .map((group) => mergeNonMatchEventGroup(group));
  let matches = events
    .filter((e) => e.match)
    .map((e) => ({
      title: `olympicks: ${e.discipline.description}${
        formatMatchEntry(e.match)
      }${formatMedalEvent(e.medal)}`,
      start: e.start,
      end: e.end,
      description: `${e.description}${formatMatchEntry(e.match)}`,
    }));

  return [...merged.flat(), ...matches];
}

/**
 * @param {Array<Event>} events
 * @returns {string}
 */
export function createIcsEntry(events) {
  let result = ics.createEvents(
    combineEntries(events).map((event) => ({
      title: event.title,
      description: event.description,
      start: convertToIcsDate(event.start),
      end: convertToIcsDate(event.end),
      startInputType: "utc",
      startOutputType: "utc",
      endInputType: "utc",
      endOutputType: "utc",
    })),
  );
  if (result.error) {
    throw result.error;
  }
  // @ts-expect-error ics typings are wrong
  return result.value;
}
