import { z } from "zod";
import { idForEvent } from "./id-for-event.js";

/** @typedef {z.infer<typeof eventSchema>} Event */
/** @typedef {z.infer<typeof labelSchema>} Label */

/** Represents a named entity */
const labelSchema = z.object({
	code: z.string(),
	description: z.string(),
}).transform((d) => ({
	name: d.description,
	shortName: d.code,
}));

/** Represents a match */
const matchSchema = z.union([
	// known: team vs team
	z.object({
		team1: labelSchema,
		team2: labelSchema,
	}),
	// unknown (tbd)
	z.object({}),
	// not applicable
	z.undefined(),
]).transform(
	d => d === undefined ? null : d,
)

/** Represents an olympic event */
export const eventSchema = z.object({
	checked: z.boolean().default(false),
	start: z.string().datetime(),
	end: z.string().datetime(),
	description: z.string(),
	medal: z.enum(["", "1", "2", "3"]),
	discipline: labelSchema,
	match: matchSchema,
	venue: labelSchema.optional().transform(v => v ? v : null),
}).transform(
	(d) => ({ ...d, id: idForEvent(d) }),
);
