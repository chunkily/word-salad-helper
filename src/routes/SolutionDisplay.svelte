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
	let selectionInOptions = $derived(lengthOptions.includes(lengthFilter));

	let lengthFilteredWords = $derived(
		orderedWords.filter(
			(word) =>
				lengthFilter == 0 ||
				// Handle case where we select an option, then recalculate and the option disappears
				!selectionInOptions ||
				word.length == lengthFilter
		)
	);

	let beforeFilter = $state<string>('');
	let afterFilter = $state<string>('');

	let filteredWords = $derived(
		lengthFilteredWords.filter(
			(word) =>
				(beforeFilter === '' || word.localeCompare(beforeFilter) > 0) &&
				(afterFilter === '' || word.localeCompare(afterFilter) < 0)
		)
	);
</script>

<div class="mb-4">
	<p class="mb-2 text-sm font-medium">Filter by length:</p>
	<div class="flex flex-wrap gap-3">
		<label class="flex cursor-pointer items-center gap-2 hover:text-blue-600">
			<input type="radio" bind:group={lengthFilter} value={0} class="cursor-pointer" />
			<span>All</span>
		</label>
		{#each lengthOptions as len}
			<label class="flex cursor-pointer items-center gap-2 hover:text-blue-600">
				<input type="radio" bind:group={lengthFilter} value={len} class="cursor-pointer" />
				<span>{len}</span>
			</label>
		{/each}
	</div>
</div>
<div class="mb-4">
	<p class="mb-2 text-sm font-medium">Filter alphabetically:</p>
	<div class="flex items-end gap-2">
		<div class="flex-1">
			<label for="beforeFilter" class="mb-1 block text-xs text-gray-600">After:</label>
			<input
				type="text"
				id="beforeFilter"
				bind:value={beforeFilter}
				class="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
		</div>
		<div class="flex-1">
			<label for="afterFilter" class="mb-1 block text-xs text-gray-600">Before:</label>
			<input
				type="text"
				id="afterFilter"
				bind:value={afterFilter}
				class="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
		</div>
		<button
			onclick={() => {
				beforeFilter = '';
				afterFilter = '';
			}}
			class="cursor-pointer rounded bg-gray-200 px-4 py-2 transition-colors hover:bg-gray-300"
			>Clear</button
		>
	</div>
</div>
<h3 class="mt-2 mb-4 font-semibold">
	{filteredWords.length} words
	{#if lengthFilteredWords.length !== filteredWords.length}({lengthFilteredWords.length} before alphabetical
		filter){/if}
</h3>
<div class="max-h-96 overflow-y-auto rounded-lg bg-gray-100 p-4">
	<ul class="space-y-1">
		{#each filteredWords as word (word)}
			<li>
				<button
					onclick={() => {
						if (highlighted === word) {
							highlighted = '';
						} else {
							highlighted = word;
						}
					}}
					class="w-full cursor-pointer rounded px-4 py-2 text-left transition-colors hover:bg-blue-100 {word ===
					highlighted
						? 'bg-yellow-200 font-semibold hover:bg-yellow-300'
						: 'bg-white hover:bg-blue-50'}"
					>{word} <span class="text-gray-500">({word.length})</span></button
				>
			</li>
		{/each}
	</ul>
</div>
