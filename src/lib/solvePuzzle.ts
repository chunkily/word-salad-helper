import { isPrefix, loadTrie, search } from './trie';

const PUZZLE_SIZE = 4;
const MAX_INDEX = PUZZLE_SIZE - 1;

export default async function solvePuzzle(puzzle: string[][]) {
	const trie = await loadTrie();

	const results = [];
	const queue = [];
	for (let i = 0; i < MAX_INDEX; i++) {
		for (let j = 0; j < MAX_INDEX; j++) {
			queue.push([[i, j]]);
		}
	}

	while (queue.length > 0) {
		const path = queue.pop();
		if (path == undefined) {
			throw 'Unexpected undefined queue element';
		}

		const chars = path
			.map((el) => {
				const i = el[0];
				const j = el[1];
				return puzzle[i][j];
			})
			.join();

		if (isPrefix(trie, chars)) {
			const head = path[path.length - 1];
			for (const adj of adjacent(head[0], head[1])) {
				if (!inPath(adj, path)) {
					const newPath = path.slice();
					newPath.push(adj);
					queue.push(newPath);
				}
			}
		}

		if (search(trie, chars)) {
			results.push({
				path,
				word: chars
			});
		}
	}

	results.sort();
	return results;
}

function inPath(node: number[], path: number[][]) {
	for (const el of path) {
		if (el[0] === node[0] && el[1] === node[1]) {
			return true;
		}
	}
	return false;
}

function adjacent(i: number, j: number) {
	const adj = [];

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
