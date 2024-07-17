// deno run -A --unstable-temporal main.ts
import { JSDOM } from "npm:jsdom@11.8.0";
import { z } from "npm:zod@3.23.8";

let disciplinesSchema = z.object({
  disciplineCode: z.string(),
  description: z.string(),
}).transform((data) => ({
  code: data.disciplineCode,
  description: data.description,
}));

let unitSchema = z.object({
  startDateTimeUtc: z.string().datetime(),
  endDateTimeUtc: z.string().datetime(),
  description: z.string(),
  medal: z.string(),
  match: z.union([
    z.object({
      team1: z.object({ description: z.string(), teamCode: z.string() }),
      team2: z.object({ description: z.string(), teamCode: z.string() }),
    }).transform((data) => ({
      team1: { description: data.team1.description, code: data.team1.teamCode },
      team2: { description: data.team2.description, code: data.team2.teamCode },
    })),
    z.object({}),
    z.undefined(),
  ]),
}).transform((data) => ({
  start: Temporal.Instant.from(data.startDateTimeUtc),
  end: Temporal.Instant.from(data.endDateTimeUtc),
  description: data.description,
  medal: data.medal,
  match: data.match,
}));

let scheduleSchema = z.object({
  units: z.array(unitSchema),
  discipline: disciplinesSchema,
  venue: z
    .object({ venueCode: z.string(), description: z.string() })
    .transform((data) => ({
      code: data.venueCode,
      description: data.description,
    }))
    .optional(),
});

let scheduleWrapperSchema = z.object({
  disciplines: z.array(disciplinesSchema),
  schedules: z.array(scheduleSchema),
});

let nextDataSchema = z.object({
  props: z.object({
    pageProps: z.object({
      page: z.object({
        items: z.array(z.any()),
      }),
    }),
  }),
}).transform((data) => {
  let item = data.props.pageProps.page.items.find((item) =>
    item.name === "scheduleWrapper"
  );
  return scheduleWrapperSchema.parse(item.data);
}).transform((data) =>
  data.schedules.flatMap((s) =>
    s.units.map((u) => ({ ...u, discipline: s.discipline, venue: s.venue }))
  )
);

const base = new URL("https://olympics.com/en/paris-2024/schedule/");
const nested = await Promise.all([
  "24-july",
  "25-july",
  "26-july",
  "27-july",
  "28-july",
  "29-july",
  "30-july",
  "31-july",
  "1-august",
  "2-august",
  "3-august",
  "4-august",
  "5-august",
  "6-august",
  "7-august",
  "8-august",
  "9-august",
  "10-august",
  "11-august",
].map((page) =>
  fetch(new URL(page, base)).then(async (res) => {
    const text = await res.text();
    const { window: { document } } = new JSDOM(text);
    const node = document.querySelector("#__NEXT_DATA__");
    const data = nextDataSchema.parse(JSON.parse(node.textContent));
    return data;
  })
));
Deno.writeTextFile("data.json", JSON.stringify(nested.flat(), null, 2));
