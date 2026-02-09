import { describe, expect, it } from 'vitest';
import solvePuzzle, { adjacent } from './solvePuzzle';

describe('solvePuzzle', () => {
	it('should solve a simple puzzle', async () => {
		const puzzle = [
			['C', 'A', 'T', 'S'],
			['O', 'D', 'O', 'O'],
			['G', 'S', 'A', 'W'],
			['S', 'A', 'T', 'E']
		];

		const results = await solvePuzzle(puzzle);

		// Should find a few words
		expect(results).toHaveProperty('CAT');
		expect(results).toHaveProperty('DOG');
		expect(results).toHaveProperty('STOOD');
	});

	it('should find no words in an empty puzzle', async () => {
		const puzzle = [
			['X', 'X', 'X', 'X'],
			['X', 'X', 'X', 'X'],
			['X', 'X', 'X', 'X'],
			['X', 'X', 'X', 'X']
		];

		const results = await solvePuzzle(puzzle);

		// Unlikely to find valid words with all X's
		expect(Object.keys(results).length).toBe(0);
	});

	it('should return results with valid paths', async () => {
		const puzzle = [
			['C', 'A', 'T', 'S'],
			['O', 'D', 'O', 'O'],
			['G', 'S', 'A', 'W'],
			['S', 'A', 'T', 'E']
		];

		const results = await solvePuzzle(puzzle);

		for (const word in results) {
			// Path should contain valid indices
			for (const [i, j] of results[word]) {
				expect(i).toBeGreaterThanOrEqual(0);
				expect(i).toBeLessThan(4);
				expect(j).toBeGreaterThanOrEqual(0);
				expect(j).toBeLessThan(4);
			}

			// Word should not be empty
			expect(word.length).toBeGreaterThan(0);
		}
	});

	it('should be able to handle spaces in the puzzle', async () => {
		const puzzle = [
			['C', 'A', ' ', 'S'],
			['O', 'D', 'O', 'O'],
			['G', ' ', 'A', 'W'],
			['S', 'A', 'T', 'E']
		];
		const results = await solvePuzzle(puzzle);
		expect(results).toHaveProperty('DOG');
	});

	it('should have correct paths for found words', async () => {
		const puzzle = [
			['C', 'A', 'T', 'S'],
			['O', 'D', 'O', 'O'],
			['G', 'S', 'A', 'W'],
			['S', 'A', 'T', 'E']
		];
		const results = await solvePuzzle(puzzle);

		for (const word in results) {
			const path = results[word];
			let constructedWord = '';
			for (const [i, j] of path) {
				constructedWord += puzzle[i][j];
			}
			expect(constructedWord).toBe(word);
		}
	});
});

describe('adjacent', () => {
	it('should return all adjacent cells', () => {
		const result = adjacent(1, 1);
		const expected = [
			[0, 0],
			[0, 1],
			[0, 2],
			[1, 0],
			[1, 2],
			[2, 0],
			[2, 1],
			[2, 2]
		];
		expect(result).toEqual(expect.arrayContaining(expected));
	});

	it('should handle edge cells correctly', () => {
		const result = adjacent(0, 0);
		const expected = [
			[0, 1],
			[1, 0],
			[1, 1]
		];
		expect(result).toEqual(expect.arrayContaining(expected));
	});
});
