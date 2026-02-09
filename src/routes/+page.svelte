<script lang="ts">
	import type { PageProps } from './$types';
	import { navigating } from '$app/state';
	import SolutionDisplay from './SolutionDisplay.svelte';

	let { data }: PageProps = $props();

	let inputRefs: HTMLInputElement[] = [];
	let formElement: HTMLFormElement;

	// Svelte warns that only the initial value of data is used,
	// which is exactly what we want here.
	// svelte-ignore state_referenced_locally
	let puzzleState = $state<string[][]>(data.puzzle);

	let hiddenValue = $derived(
		puzzleState
			.map((row) => row.map((cell) => cell || ' ').join(''))
			.join('')
			.toLowerCase()
	);

	let highlightedWord = $state<string>('');
	let highlightedPath = $derived(
		highlightedWord && data.solutions[highlightedWord] ? data.solutions[highlightedWord] : []
	);

	function isInHighlightedPath(row: number, col: number): boolean {
		return highlightedPath.some((coord) => coord[0] === row && coord[1] === col);
	}

	function handleKeyDown(event: KeyboardEvent, row: number, col: number) {
		event.preventDefault();
		const key = event.key;
		if (key === 'Backspace') {
			puzzleState[row][col] = '';
			let prevRef = inputRefs[row * 4 + col - 1];
			if (prevRef) {
				prevRef.focus();
			}
			return;
		}

		if ((event.key == 'Tab' && event.shiftKey) || key == 'ArrowLeft') {
			let prevRef = inputRefs[row * 4 + col - 1];
			if (prevRef) {
				prevRef.focus();
			}
			return;
		}

		if (key == 'Tab' || key == 'ArrowRight' || key == ' ') {
			let nextRef = inputRefs[row * 4 + col + 1];
			if (nextRef) {
				nextRef.focus();
			}
			return;
		}

		if (key == 'ArrowUp') {
			let prevRef = inputRefs[(row - 1) * 4 + col];
			if (prevRef) {
				prevRef.focus();
			}
			return;
		}

		if (key == 'ArrowDown') {
			let nextRef = inputRefs[(row + 1) * 4 + col];
			if (nextRef) {
				nextRef.focus();
			}
			return;
		}

		if (key == 'Enter') {
			let nextRef = inputRefs[(row + 1) * 4];
			if (nextRef) {
				nextRef.focus();
			} else {
				submitPuzzle();
			}
			return;
		}

		if (/^[a-zA-Z]$/.test(key)) {
			puzzleState[row][col] = key.toUpperCase();
			let nextRef = inputRefs[row * 4 + col + 1];
			if (nextRef) {
				nextRef.focus();
			}
		}
	}

	function submitPuzzle() {
		formElement.requestSubmit();
	}

	function clearPuzzle() {
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				puzzleState[i][j] = ' ';
			}
		}
		inputRefs[0].focus();
		highlightedWord = '';
	}
</script>

<div class="m-4">
	<h1 class="mb-4 text-3xl font-bold">Word Salad Helper</h1>
	<div class="flex flex-col gap-8 md:flex-row md:items-start">
		<div class="shrink-0">
			<div class="relative mb-4 inline-block w-fit">
				<svg class="pointer-events-none absolute top-0 left-0" width="280" height="280">
					{#each highlightedPath.slice(0, -1) as coord, idx}
						{@const x1 = coord[1] * 70.4 + 35.2}
						{@const y1 = coord[0] * 70.4 + 35.2}
						{@const x2 = highlightedPath[idx + 1][1] * 70.4 + 35.2}
						{@const y2 = highlightedPath[idx + 1][0] * 70.4 + 35.2}
						<line
							{x1}
							{y1}
							{x2}
							{y2}
							stroke="#3b82f6"
							stroke-width="8"
							stroke-linecap="round"
						/>
					{/each}
				</svg>
				{#each [0, 1, 2, 3] as i}
					{#each [0, 1, 2, 3] as j}
						<input
							bind:this={inputRefs[i * 4 + j]}
							type="text"
							maxlength="1"
							class="relative z-10 m-[0.2rem] h-16 w-16 border border-gray-300 text-center text-2xl"
							class:bg-blue-500={isInHighlightedPath(i, j)}
							class:text-white={isInHighlightedPath(i, j)}
							class:font-bold={isInHighlightedPath(i, j)}
							id="tile-{i}-{j}"
							value={puzzleState[i][j] || ''}
							onkeydown={(e) => handleKeyDown(e, i, j)}
						/>
					{/each}
					<br />
				{/each}
			</div>
			<form method="GET" action="./" bind:this={formElement}>
				<input type="hidden" name="p" value={hiddenValue} />

				{#if navigating.to}
					<p>Solving puzzle...</p>
				{:else}
					<div class="flex gap-3">
						<button
							type="submit"
							class="cursor-pointer rounded bg-blue-500 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-600"
							>Solve</button
						>
						<button
							type="button"
							onclick={clearPuzzle}
							class="cursor-pointer rounded bg-gray-200 px-6 py-2 transition-colors hover:bg-gray-300"
							>Clear</button
						>
					</div>
				{/if}
			</form>
		</div>

		{#if Object.keys(data.solutions).length > 0}
			<div class="min-w-0 md:flex-1">
				<h2 class="mb-4 text-2xl font-bold">Solutions</h2>
				<SolutionDisplay solutions={data.solutions} bind:highlighted={highlightedWord} />
			</div>
		{/if}
	</div>
</div>
