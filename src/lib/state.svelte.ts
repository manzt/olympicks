import type * as schema from "$lib/schema.ts";

/** Represents an Olympic event that is selecatble. */
export class SelectableEvent {
	checked = $state(false);
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

	constructor(label: schema.Label, events: Array<schema.Event>) {
		this.label = label;
		this.events = events.map((event) => new SelectableEvent(event));
	}

	reset(): void {
		this.open = false;
		// biome-ignore lint/complexity/noForEach: this is more concise
		this.events.forEach((event) => {
			event.checked = false;
		});
	}
}

export type EventGroupData = Omit<EventGroup, "reset">;

/** Represents a Section of Olympic events. */
export class Section {
	title: string;
	items: Array<EventGroup>;
	constructor(title: string, items: Array<EventGroupData>) {
		this.title = title;
		this.items = items.map((item) => new EventGroup(item.label, item.events));
	}

	reset(): void {
		// biome-ignore lint/complexity/noForEach: This is more concise
		this.items.forEach((group) => group.reset());
	}
}
