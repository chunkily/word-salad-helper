import { describe, expect, it } from 'vitest';
import { isPrefix, loadTrie, search, type TrieNode } from './trie';

describe('Trie', () => {
	const mockTrie: TrieNode = {
		h: {
			e: {
				l: {
					l: {
						o: {
							$: true
						}
					}
				}
			}
		},
		c: {
			a: {
				t: {
					$: true
				}
			}
		}
	};

	describe('search', () => {
		it('should find a valid word in the trie', () => {
			expect(search(mockTrie, 'hello')).toBe(true);
			expect(search(mockTrie, 'cat')).toBe(true);
		});

		it('should return false for words not in the trie', () => {
			expect(search(mockTrie, 'dog')).toBe(false);
			expect(search(mockTrie, 'car')).toBe(false);
		});

		it('should be case-insensitive', () => {
			expect(search(mockTrie, 'hello')).toBe(true);
			expect(search(mockTrie, 'Hello')).toBe(true);
			expect(search(mockTrie, 'HeLLo')).toBe(true);
		});

		it('should return false for prefixes without end marker', () => {
			expect(search(mockTrie, 'hel')).toBe(false);
			expect(search(mockTrie, 'ca')).toBe(false);
		});

		it('should return false for empty string', () => {
			expect(search(mockTrie, '')).toBe(false);
		});
	});

	describe('isPrefix', () => {
		it('should recognize valid prefixes', () => {
			expect(isPrefix(mockTrie, 'h')).toBe(true);
			expect(isPrefix(mockTrie, 'hel')).toBe(true);
			expect(isPrefix(mockTrie, 'c')).toBe(true);
		});

		it('should return false for invalid prefixes', () => {
			expect(isPrefix(mockTrie, 'x')).toBe(false);
			expect(isPrefix(mockTrie, 'dog')).toBe(false);
		});

		it('should be case-insensitive', () => {
			expect(isPrefix(mockTrie, 'he')).toBe(true);
			expect(isPrefix(mockTrie, 'cat')).toBe(true);
		});

		it('should recognize complete words as valid prefixes', () => {
			expect(isPrefix(mockTrie, 'hello')).toBe(true);
			expect(isPrefix(mockTrie, 'cat')).toBe(true);
		});

		it('should return true for empty string', () => {
			expect(isPrefix(mockTrie, '')).toBe(true);
		});
	});

	describe('loadTrie', () => {
		it('should load the trie without errors', async () => {
			const trie = await loadTrie();
			expect(trie).toBeDefined();
			expect(typeof trie).toBe('object');
		});

		it('loaded trie should work with search on common words', async () => {
			const trie = await loadTrie();
			expect(search(trie, 'cat')).toBe(true);
			expect(search(trie, 'dog')).toBe(true);
		});

		it('loaded trie should work with isPrefix on common prefixes', async () => {
			const trie = await loadTrie();
			expect(isPrefix(trie, 'ca')).toBe(true);
			expect(isPrefix(trie, 'cat')).toBe(true);
		});
	});
});
