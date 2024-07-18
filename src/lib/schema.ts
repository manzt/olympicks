import { z } from "zod";

export type Event = z.infer<typeof eventSchema>;
export type Label = z.infer<typeof labelSchema>;
export type Match = z.infer<typeof matchSchema>;

/** Represents a named entity */
const labelSchema = z
	.object({
		code: z.string(),
		description: z.string(),
	})
	.transform((d) => ({
		name: d.description,
		shortName: d.code,
	}));

/** Represents a match */
const matchSchema = z.union([
	// known: team vs team
	z
		.object({
			team1: labelSchema,
			team2: labelSchema,
		})
		.transform((d) => ({ ...d, kind: "known" }) as const),
	// unknown (tbd)
	z
		.object({})
		.transform(() => ({ kind: "unknown" }) as const),
	// not applicable
	z
		.undefined()
		.transform(() => ({ kind: "none" }) as const),
]);

/** Represents an olympic event */
export const eventSchema = z.object({
	checked: z.boolean().default(false),
	start: z.string().datetime(),
	end: z.string().datetime(),
	description: z.string(),
	medal: z.enum(["", "1", "2", "3"]),
	discipline: labelSchema,
	match: matchSchema,
	venue: labelSchema.optional().transform((v) => (v ? v : null)),
	id: z.string(),
});
