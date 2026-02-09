<script lang="ts">
	import type { PageProps } from './$types';
	import { navigating } from '$app/state';
	import SolutionDisplay from './SolutionDisplay.svelte';

	let { data }: PageProps = $props();

	let inputRefs: HTMLInputElement[] = [];
	let formElement = $state<HTMLFormElement>();

	let puzzleState = $state<string[][]>([
		[' ', ' ', ' ', ' '],
		[' ', ' ', ' ', ' '],
		[' ', ' ', ' ', ' '],
		[' ', ' ', ' ', ' ']
	]);
	$effect(() => {
		if (data.puzzle) {
			for (let i = 0; i < 4; i++) {
				for (let j = 0; j < 4; j++) {
					puzzleState[i][j] = data.puzzle[i][j] || ' ';
				}
			}
		}
	});

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
	const maxAccentIndex = 12;

	function isInHighlightedPath(row: number, col: number): boolean {
		return highlightedPath.some((coord) => coord[0] === row && coord[1] === col);
	}

	function getHighlightIndex(row: number, col: number): number {
		return highlightedPath.findIndex((coord) => coord[0] === row && coord[1] === col);
	}

	function handleKeyDown(event: KeyboardEvent, row: number, col: number) {
		event.preventDefault();
		const key = event.key;
		if (key === 'Backspace' || key === 'Delete') {
			puzzleState[row][col] = ' ';
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
		if (formElement) {
			formElement.requestSubmit();
		}
	}
</script>

<div class="m-4">
	<h1 class="mb-4 text-3xl font-bold">Word Salad Helper</h1>
	<div class="flex flex-col gap-8 md:flex-row md:items-start">
		<div class="shrink-0">
			<div class="puzzle-board relative mb-4 inline-block w-fit">
				<svg class="pointer-events-none absolute top-0 left-0" width="280" height="280">
					<defs>
						{#each highlightedPath.slice(0, -1) as coord, idx}
							{@const accentIndexStart = Math.min(idx, maxAccentIndex)}
							{@const accentIndexEnd = Math.min(idx + 1, maxAccentIndex)}
							{@const x1 = coord[1] * 70.4 + 35.2}
							{@const y1 = coord[0] * 70.4 + 35.2}
							{@const x2 = highlightedPath[idx + 1][1] * 70.4 + 35.2}
							{@const y2 = highlightedPath[idx + 1][0] * 70.4 + 35.2}
							<linearGradient
								id="gradient-{idx}"
								{x1}
								{y1}
								{x2}
								{y2}
								gradientUnits="userSpaceOnUse"
							>
								<stop
									offset="0%"
									style={`stop-color: var(--accent-color-${accentIndexStart})`}
								/>
								<stop
									offset="100%"
									style={`stop-color: var(--accent-color-${accentIndexEnd})`}
								/>
							</linearGradient>
						{/each}
					</defs>
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
							class="path-line"
							stroke="url(#gradient-{idx})"
							stroke-width="8"
							stroke-linecap="round"
						/>
					{/each}
				</svg>
				{#each [0, 1, 2, 3] as i}
					{#each [0, 1, 2, 3] as j}
						{@const highlightIndex = getHighlightIndex(i, j)}
						{@const accentIndex =
							highlightIndex >= 0 ? Math.min(highlightIndex, maxAccentIndex) : 0}
						<input
							bind:this={inputRefs[i * 4 + j]}
							type="text"
							maxlength="1"
							class="tile-input relative z-10 m-[0.2rem] h-16 w-16 border border-gray-300 text-center text-2xl"
							class:highlighted={isInHighlightedPath(i, j)}
							style={highlightIndex >= 0
								? `--accent-color: var(--accent-color-${accentIndex})`
								: ''}
							id="tile-{i}-{j}"
							value={puzzleState[i][j] || ''}
							onkeydown={(e) => handleKeyDown(e, i, j)}
						/>
					{/each}
					<br />
				{/each}
			</div>
			<div class="flex">
				{#if navigating.to}
					<p>Loading...</p>
				{:else}
					<form method="GET" action="./" bind:this={formElement}>
						<input type="hidden" name="p" value={hiddenValue} />

						<div class="flex gap-3">
							<button
								type="submit"
								class="cursor-pointer rounded bg-blue-500 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-600"
								>Solve</button
							>
						</div>
					</form>
					<form method="GET" action="./" class="ml-2">
						<button
							type="submit"
							class="cursor-pointer rounded bg-gray-200 px-6 py-2 transition-colors hover:bg-gray-300"
							>Clear</button
						>
					</form>
				{/if}
			</div>
		</div>

		{#if Object.keys(data.solutions).length > 0}
			<div class="min-w-0 md:flex-1">
				<h2 class="mb-4 text-2xl font-bold">Solutions</h2>
				<SolutionDisplay solutions={data.solutions} bind:highlighted={highlightedWord} />
			</div>
		{/if}
	</div>
</div>

<style>
	.puzzle-board {
		--accent-color-0: #01c131;
		--accent-color-1: #00c675;
		--accent-color-2: #00cbba;
		--accent-color-3: #00c4dc;
		--accent-color-4: #00befe;
		--accent-color-5: #0093fe;
		--accent-color-6: #0069fe;
		--accent-color-7: #003ffe;
		--accent-color-8: #0015fe;
		--accent-color-9: #200afe;
		--accent-color-10: #4000fe;
		--accent-color-11: #6a00fe;
		--accent-color-12: #9400fe;
	}

	.tile-input {
		transition:
			background-color 240ms ease,
			color 240ms ease,
			border-color 240ms ease;
	}

	.tile-input.highlighted {
		background-color: var(--accent-color);
		border-color: var(--accent-color);
		color: #ffffff;
		font-weight: 700;
	}

	.path-line {
		stroke-dasharray: 240;
		stroke-dashoffset: 240;
		animation: draw-line 320ms ease forwards;
	}

	@keyframes draw-line {
		to {
			stroke-dashoffset: 0;
		}
	}
</style>
