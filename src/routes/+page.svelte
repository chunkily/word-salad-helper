<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div>
	<h1>Word List</h1>
	<ul>
		{#each data.wordlist as word}
			<li>{word}</li>
		{/each}
	</ul>
</div>
