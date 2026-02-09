<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div>
	<ul>
		{#each data.wordlist as word}
			<li>{word}</li>
		{/each}
	</ul>
</div>
