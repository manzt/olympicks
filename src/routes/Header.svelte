<script>
	import { page } from "$app/stores";
</script>

<header class="flex justify-between">
	<nav
		class="flex justify-center"
		style="--background: rgba(255, 255, 255, 0.7);"
	>
		<svg viewBox="0 0 2 3" aria-hidden="true" class="w-8 h-12">
			<path
				d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z"
				class="fill-current"
				style="fill: var(--background);"
			/>
		</svg>
		<ul
			class="relative p-0 m-0 h-12 flex justify-center items-center list-none"
			style="background: var(--background); background-size: contain;"
		>
			<li
				class="relative h-full"
				aria-current={$page.url.pathname === "/" ? "page" : undefined}
			>
				<a
					href="/"
					class="flex h-full items-center px-2 text-gray-800 font-bold text-xs uppercase tracking-wide no-underline transition-colors duration-200 hover:text-theme-1"
					>Home</a
				>
				{#if $page.url.pathname === "/"}
					<span
						class="absolute top-0 left-1/2 w-0 h-0"
						style="transform: translateX(-50%); border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid var(--color-theme-1);"
					></span>
				{/if}
			</li>
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true" class="w-8 h-12">
			<path
				d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z"
				class="fill-current"
				style="fill: var(--background);"
			/>
		</svg>
	</nav>
</header>
