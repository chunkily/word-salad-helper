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
	}
</script>

<div>
	<h1>Word Salad Helper</h1>
	{#each [0, 1, 2, 3] as i}
		{#each [0, 1, 2, 3] as j}
			<input
				bind:this={inputRefs[i * 4 + j]}
				type="text"
				maxlength="1"
				class="tile"
				id="tile-{i}-{j}"
				value={puzzleState[i][j] || ''}
				onkeydown={(e) => handleKeyDown(e, i, j)}
			/>
		{/each}
		<br />
	{/each}
	<form method="GET" action="./" bind:this={formElement}>
		<input type="hidden" name="p" value={hiddenValue} />

		{#if navigating.to}
			<p>Solving puzzle...</p>
		{:else}
			<button type="submit">Solve</button>
			<button type="button" onclick={clearPuzzle}>Clear</button>
		{/if}
	</form>

	{#if Object.keys(data.solutions).length > 0}
		<div>
			<h2>Solutions</h2>
			<SolutionDisplay solutions={data.solutions} bind:highlighted={highlightedWord} />
		</div>
	{/if}

	<div>
		Puzzle: {JSON.stringify(puzzleState)}
	</div>
	<div>
		Solutions: {JSON.stringify(data.solutions)}
	</div>
	<div>
		Highlighted Word: {highlightedWord}
		Highlighted Path: {JSON.stringify(highlightedPath)}
	</div>
</div>

<style>
	.tile {
		width: 4rem;
		height: 4rem;
		font-size: 1.5rem;
		text-align: center;
		margin: 0.5rem;
	}
	div {
		margin: 1rem;
	}
	h1 {
		margin-bottom: 1rem;
	}
</style>
