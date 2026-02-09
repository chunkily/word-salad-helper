import solvePuzzle from '$lib/solvePuzzle';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const query = url.searchParams.get('p') || '';

	const puzzle: string[][] = [
		[' ', ' ', ' ', ' '],
		[' ', ' ', ' ', ' '],
		[' ', ' ', ' ', ' '],
		[' ', ' ', ' ', ' ']
	];

	let solutions: Record<string, number[][]> = {};

	if (query.length !== 16) {
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
