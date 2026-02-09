import wordlist_trie from './assets/wordlist-trie.json';

interface TrieNode {
	[key: string]: TrieNode | boolean;
}

export async function loadTrie(): Promise<TrieNode> {
	return wordlist_trie as TrieNode;
}

/** Returns true if the word is in the trie */
export function search(trie: TrieNode, word: string): boolean {
	let node = trie;

	for (const char of word) {
		if (!node[char]) return false;
		node = node[char] as TrieNode;
	}

	return node['$'] === true;
}

/** Returns true if the prefix is a valid prefix in the trie */
export function isPrefix(trie: TrieNode, prefix: string): boolean {
	let node = trie;

	for (const char of prefix) {
		if (!node[char]) return false;
		node = node[char] as TrieNode;
	}

	const keys = Object.keys(node);
	keys.splice(keys.indexOf('$'), 1);
	return keys.length > 0;
}
