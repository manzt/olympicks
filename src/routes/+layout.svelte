<script lang="ts">
import type { Snippet } from "svelte";
import "../app.css";

let props: { children: Snippet } = $props();
let showOnPixel = 150;
let hidden = $state(true);
</script>

<svelte:window
	on:scroll={() => {
		let container = document.documentElement || document.body;
		if (!container) return;
		if (container.scrollTop > showOnPixel) {
			hidden = false;
		} else {
			hidden = true;
		}
	}}
/>

<div class="flex flex-col min-h-screen">
	<main class="flex-1 flex flex-col p-4 w-full max-w-4xl mx-auto box-border">
		{@render props.children()}
	</main>

	
	<button
		class:hidden
		class="sticky bottom-16 sm:bottom-10 lg:bottom-5 right-10 bg-black text-white lg:bg-transparent lg:w-36 lg:text-black self-end z-20 rounded-full w-10 h-10 border-none cursor-pointer flex items-center justify-center hover:opacity-70 focus-visible:outline-none focus-visible:outline-black"
		onmousedown={() => {
			window.scrollTo({ top: 0, behavior: "auto" })
			// pages can subscribe to this event to do something
			// when the user clicks back to top (i.e., close the open sections)
			window.dispatchEvent(new CustomEvent("back-to-top"));
		}}
	>
		<span>↑</span>
		<span class="ml-2 hidden lg:block">back to top</span>
	</button>

	<footer
		class="comic-sans w-full flex justify-center text-gray-600 text-center items-center pb-10"
	>
		<p>
			made by
			<a href="https://trevorma.nz" class="font-bold">trevor manz</a>.
			data from
			<a href="https://olympics.com" class="font-bold">olympics.com</a>
			<a href="https://github.com/manzt/olympicks">
				<svg
					viewBox="0 0 98 98"
					class="w-4 h-4 inline -mt-0.5 ml-1"
					fill="currentColor"
					><path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
						fill="#24292f"
					/></svg
				>
			</a>
		</p>
	</footer>
</div>
