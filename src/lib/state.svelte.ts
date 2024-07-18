import type * as schema from "$lib/schema.ts";

/** Represents an Olympic event that is selecatble. */
export class SelectableEvent {
	checked = $state(false);
	visible = $state(true);
	id: string;
	start: string;
	end: string;
	description: string;
	medal: schema.Event["medal"];
	discipline: schema.Label;
	venue: schema.Event["venue"];
	match: schema.Event["match"];

	constructor(options: schema.Event) {
		this.id = options.id;
		this.start = options.start;
		this.end = options.end;
		this.description = options.description;
		this.medal = options.medal;
		this.discipline = options.discipline;
		this.venue = options.venue;
		this.checked = options.checked;
		this.match = options.match;
	}
}

/** Represents a collapsible group of Olympic events. */
export class EventGroup {
	open = $state(false);
	label: schema.Label;
	events: Array<SelectableEvent>;

	constructor(label: schema.Label, events: Array<SelectableEvent>) {
		this.label = label;
		this.events = events;
	}

	reset(): void {
		this.open = false;
		// biome-ignore lint/complexity/noForEach: this is more concise
		this.events.forEach((event) => {
			event.checked = false;
		});
	}
}
