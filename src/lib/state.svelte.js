/** @import * as schema from "./schema.js" */

/** Represents an Olympic event that is selecatble. */
export class SelectableEvent {
	checked = $state(false);
	/** @param {schema.Event} options */
	constructor(options) {
		/** @type {string} */
		this.id = options.id;
		/** @type {string} */
		this.start = options.start;
		/** @type {string} */
		this.end = options.end;
		/** @type {string} */
		this.description = options.description;
		/** @type {schema.Event["medal"]} */
		this.medal = options.medal;
		/** @type {schema.Label} */
		this.discipline = options.discipline;
		/** @type {schema.Label | null} */
		this.venue = options.venue;
		/** @type {boolean} */
		this.checked = options.checked;
		/** @type {schema.Event["match"]} */
		this.match = options.match;
	}
}

/** Represents a collapsible group of Olympic events. */
export class EventGroup {
	open = $state(false);
	/**
	 * @param {schema.Label} label
	 * @param {Array<schema.Event>} events
	 */
	constructor(label, events) {
		/** @type {schema.Label} */
		this.label = label;
		/** @type {Array<SelectableEvent>} */
		this.events = events.map((event) => new SelectableEvent(event));
	}

	toggle() {
		this.open = !this.open;
	}

	reset() {
		this.open = false;
		// biome-ignore lint/complexity/noForEach: this is more concise
		this.events.forEach((event) => {
			event.checked = false;
		});
	}
}

/** @typedef {Omit<EventGroup, "toggle"| "reset">} EventGroupData */

/** Represents a Section of Olympic events. */
export class Section {
	/**
	 * @param {string} title
	 * @param {Array<EventGroupData>} items
	 */
	constructor(title, items) {
		/** @type {string} */
		this.title = title;
		/** @type {Array<EventGroup>} */
		this.items = items.map((item) => new EventGroup(item.label, item.events));
	}

	reset() {
		// biome-ignore lint/complexity/noForEach: This is more concise
		this.items.forEach((group) => group.reset());
	}
}
