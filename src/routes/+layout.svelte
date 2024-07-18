<script>
	import "../app.css";
</script>

<div class="flex flex-col min-h-screen">
	<main class="flex-1 flex flex-col p-4 w-full max-w-4xl mx-auto box-border">
		<slot />
	</main>

	<footer class="flex flex-col justify-center items-center sm:p-0 relative">
		<p>
			created by <a href="https://github.com/manzt" class="font-bold"
				>@manzt</a
			>
			with data from
			<a href="https://olympics.com" class="font-bold">olympics.com</a>
		</p>
	</footer>
</div>
