import { isPrefix, loadTrie, search } from './trie';

const PUZZLE_SIZE = 4;
const MAX_INDEX = PUZZLE_SIZE - 1;
const MAX_SOLUTIONS = 1000;
const MAX_QUEUE_SIZE = 50000;

type Coordinate = [number, number];
type Path = Coordinate[];

export default async function solvePuzzle(puzzle: string[][]) {
	const trie = await loadTrie();

	const results: Record<string, Coordinate[]> = {};

	const queue: Coordinate[][] = [];
	for (let i = 0; i < PUZZLE_SIZE; i++) {
		for (let j = 0; j < PUZZLE_SIZE; j++) {
			queue.push([[i, j]]);
		}
	}

	let iterations = 0;
	const maxIterations = 100000;

	while (queue.length > 0) {
		if (++iterations > maxIterations) {
			throw new Error('Max iterations exceeded');
		}

		if (Object.keys(results).length >= MAX_SOLUTIONS) {
			throw new Error('Max solutions reached');
		}

		if (queue.length > MAX_QUEUE_SIZE) {
			throw new Error('Queue size exceeded');
		}

		const path = queue.pop();

		if (path == undefined) {
			// Satisfy TypeScript compiler
			throw new Error('Unexpected undefined queue element');
		}

		const chars = path
			.map((el) => {
				const i = el[0];
				const j = el[1];
				return puzzle[i][j];
			})
			.join('');

		if (isPrefix(trie, chars)) {
			const tail = path[path.length - 1];
			for (const adj of adjacent(tail)) {
				if (!inPath(adj, path)) {
					const newPath = path.slice();
					newPath.push(adj);
					queue.push(newPath);
				}
			}
		}

		if (search(trie, chars)) {
			results[chars] = path;
		}
	}

	return results;
}

export function inPath(node: Coordinate, path: Path) {
	for (const el of path) {
		if (el[0] === node[0] && el[1] === node[1]) {
			return true;
		}
	}
	return false;
}

export function adjacent(coordinate: Coordinate): Coordinate[] {
	const i = coordinate[0];
	const j = coordinate[1];
	const adj: Coordinate[] = [];

	if (i > 0 && j > 0) {
		adj.push([i - 1, j - 1]);
	}
	if (i > 0) {
		adj.push([i - 1, j]);
	}
	if (i > 0 && j < MAX_INDEX) {
		adj.push([i - 1, j + 1]);
	}
	if (j > 0) {
		adj.push([i, j - 1]);
	}
	if (j < MAX_INDEX) {
		adj.push([i, j + 1]);
	}
	if (i < MAX_INDEX && j > 0) {
		adj.push([i + 1, j - 1]);
	}
	if (i < MAX_INDEX) {
		adj.push([i + 1, j]);
	}
	if (i < MAX_INDEX && j < MAX_INDEX) {
		adj.push([i + 1, j + 1]);
	}

	return adj;
}
