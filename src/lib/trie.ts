import wordlist_trie from './assets/wordlist-trie.json';

export interface TrieNode {
	[key: string]: TrieNode | boolean;
}

export async function loadTrie(): Promise<TrieNode> {
	return wordlist_trie as TrieNode;
}

/** Returns true if the word is in the trie */
export function search(trie: TrieNode, word: string): boolean {
	let node = trie;
	const normalized = word.toLowerCase();

	for (const char of normalized) {
		if (!node[char]) return false;
		node = node[char] as TrieNode;
	}

	return node['$'] === true;
}

/** Returns true if the prefix is a valid prefix in the trie */
export function isPrefix(trie: TrieNode, prefix: string): boolean {
	let node = trie;
	const normalized = prefix.toLowerCase();

	for (const char of normalized) {
		if (!node[char]) return false;
		node = node[char] as TrieNode;
	}

	return true;
}
