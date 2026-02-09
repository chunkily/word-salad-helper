/** Script to build the wordlist_trie.json file from the wordlist.txt
 * Run with:
 * npx tsx scripts/build_trie.ts
 */

import fs from 'fs';
import path from 'path';

interface TrieNode {
	[key: string]: TrieNode | boolean;
}

function buildTrie(words: string[]): TrieNode {
	const root: TrieNode = {};

	for (const word of words) {
		const normalized = word.toLowerCase().trim();
		if (!normalized) continue;

		let node = root;
		for (const char of normalized) {
			if (!node[char]) {
				node[char] = {};
			}
			node = node[char] as TrieNode;
		}
		// Mark end of word with special key
		node['$'] = true;
	}

	return root;
}

function main() {
	const wordlistPath = path.join(process.cwd(), 'scripts', 'data', 'wordlist.txt');
	const outputPath = path.join(process.cwd(), 'src', 'lib', 'assets', 'wordlist-trie.json');

	console.log('Reading wordlist from:', wordlistPath);
	const content = fs.readFileSync(wordlistPath, 'utf-8');
	const words = content.split('\n').filter((word) => word.trim().length > 0);

	console.log(`Building trie from ${words.length} words...`);
	const trie = buildTrie(words);

	console.log('Writing trie to:', outputPath);
	fs.writeFileSync(outputPath, JSON.stringify(trie), 'utf-8');

	const stats = fs.statSync(outputPath);
	console.log(`✓ Trie built successfully! Size: ${(stats.size / 1024).toFixed(2)} KB`);
}

main();
