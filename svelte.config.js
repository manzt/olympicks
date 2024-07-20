import adapter from "@sveltejs/adapter-static";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({ fallback: "404.html" }),
	},
	compilerOptions: { runes: true },
};

export default config;
