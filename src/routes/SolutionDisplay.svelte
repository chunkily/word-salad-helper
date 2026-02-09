<script lang="ts">
	let {
		solutions,
		highlighted = $bindable()
	}: { solutions: Record<string, number[][]>; highlighted: string } = $props();

	let orderedWords = $derived(Object.keys(solutions).sort((a, b) => a.localeCompare(b)));

	const lengthOptions = $derived.by(() => {
		let lengths = new Set<number>();
		for (const word of orderedWords) {
			lengths.add(word.length);
		}
		return Array.from(lengths).sort((a, b) => a - b);
	});

	let lengthFilter = $state<number>(0);

	let lengthFilteredWords = $derived(
		orderedWords.filter((word) => lengthFilter == 0 || word.length == lengthFilter)
	);

	let beforeFilter = $state<string>('');
	let afterFilter = $state<string>('');

	let filteredWords = $derived(
		lengthFilteredWords.filter(
			(word) =>
				(beforeFilter === '' || word.localeCompare(beforeFilter) >= 0) &&
				(afterFilter === '' || word.localeCompare(afterFilter) <= 0)
		)
	);
</script>

<div>
	<p>Filter by length:</p>
	<div class="flex flex-wrap gap-4">
		<label>
			<input type="radio" bind:group={lengthFilter} value={0} />
			All
		</label>
		{#each lengthOptions as len}
			<label>
				<input type="radio" bind:group={lengthFilter} value={len} />
				{len}
			</label>
		{/each}
	</div>
</div>
<div>
	<label for="beforeFilter">Filter words by those alphabetically after:</label>
	<input type="text" id="beforeFilter" bind:value={beforeFilter} />
	<label for="afterFilter"
		><span class="sr-only">Filter words by those alphabetically </span>before:</label
	>
	<input type="text" id="afterFilter" bind:value={afterFilter} />
	<button
		onclick={() => {
			beforeFilter = '';
			afterFilter = '';
		}}>Clear</button
	>
</div>
<div class="max-h-96 overflow-y-auto bg-gray-100">
	<h3 class="mt-2 mb-4">{filteredWords.length} words</h3>
	<ul>
		{#each filteredWords as word}
			<li class={word === highlighted ? 'bg-yellow-200' : ''}>
				<button
					onclick={() => {
						if (highlighted === word) {
							highlighted = '';
						} else {
							highlighted = word;
						}
					}}>{word} ({word.length})</button
				>
			</li>
		{/each}
	</ul>
</div>
