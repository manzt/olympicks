import { browser } from "$app/environment";
import posthog from "posthog-js";

export function load() {
	if (browser) {
		posthog.init("phc_VKGBPp75baQU7aQck0bqm1krGe56N7TO6AOcMjX24nv", {
			api_host: "https://us.i.posthog.com",
			person_profiles: "always",
		});
	}
}
