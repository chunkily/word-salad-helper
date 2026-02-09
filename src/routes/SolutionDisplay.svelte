<script lang="ts">
	import minmaxLengths from '$lib/minmaxLengths';

	let {
		solutions,
		highlighted = $bindable()
	}: { solutions: Record<string, number[][]>; highlighted: string } = $props();

	let orderedKeys = $derived(Object.keys(solutions).sort((a, b) => a.localeCompare(b)));
	// const { min, max } = minmaxLengths(() => orderedKeys);
	const lengthOptions = $derived.by(() => {
		let lengths = new Set<number>();
		for (const word of orderedKeys) {
			lengths.add(word.length);
		}
		return Array.from(lengths).sort((a, b) => a - b);
	});

	let lengthFilter = $state<number>(0);

	let filteredKeys = $derived(
		orderedKeys.filter((word) => lengthFilter == 0 || word.length == lengthFilter)
	);
</script>

<div>
	<label for="lengthFilter">Filter by length:</label>
	<select id="lengthFilter" bind:value={lengthFilter}>
		<option value="0">All</option>
		{#each lengthOptions as len}
			<option value={len}>{len}</option>
		{/each}
	</select>
</div>
<div class="max-h-96 overflow-y-auto bg-gray-100">
	<ul>
		{#each filteredKeys as word}
			<li class={word === highlighted ? 'bg-yellow-200' : ''}>
				<button onclick={() => (highlighted = word)}>{word} ({word.length})</button>
			</li>
		{/each}
	</ul>
</div>
