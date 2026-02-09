import solvePuzzle from '$lib/solvePuzzle';
import type { PageServerLoad } from './$types';

function isValidPuzzle(query: string): boolean {
	// Must be exactly 16 characters
	if (query.length !== 16) return false;

	// Must be all letters or spaces
	if (!/^[a-zA-Z ]{16}$/.test(query)) return false;

	// Reject puzzles with too many repeated letters (suspicious)
	const charCounts = new Map<string, number>();
	for (const char of query.toLowerCase()) {
		charCounts.set(char, (charCounts.get(char) || 0) + 1);
	}

	// No letter should appear more than 8 times
	for (const [char, count] of charCounts.entries()) {
		if (char !== ' ' && count > 8) return false;
	}

	return true;
}

export const load: PageServerLoad = async ({ url }) => {
	const query = url.searchParams.get('p') || '';

	const puzzle: string[][] = [
		[' ', ' ', ' ', ' '],
		[' ', ' ', ' ', ' '],
		[' ', ' ', ' ', ' '],
		[' ', ' ', ' ', ' ']
	];

	let solutions: Record<string, number[][]> = {};

	if (!isValidPuzzle(query)) {
		return {
			puzzle,
			solutions
		};
	}

	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			puzzle[i][j] = query[i * 4 + j].toUpperCase();
		}
	}

	solutions = await solvePuzzle(puzzle);

	return {
		puzzle,
		solutions
	};
};
