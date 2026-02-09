/** Builds the wordlist from the 3of6game.txt file.
 * Run with:
 * npx tsx scripts/build_wordlist.ts
 */

import fs from 'fs';
import path from 'path';

function buildWordlist(): string[] {
	const wordlistPath = path.join(process.cwd(), 'scripts', 'data', '3of6game.txt');
	console.log('Reading wordlist from:', wordlistPath);
	const content = fs.readFileSync(wordlistPath, 'utf-8');
	const words = content
		.split('\n')
		.map((word) => word.trim().toLowerCase())
		.filter((word) => word.length >= 2);

	// Skip the first line that contains copyright info
	words.shift();

	// Remove words with suffixes of  "$", "^", "&", "+" or "!"
	const invalidSuffixes = ['$', '^', '&', '+', '!'];
	const filteredWords = words.filter(
		(word) => !invalidSuffixes.some((suffix) => word.endsWith(suffix))
	);

	console.log(`✓ Built wordlist with ${filteredWords.length} words.`);
	return filteredWords;
}

function main() {
	const outputPath = path.join(process.cwd(), 'scripts', 'data', 'wordlist.txt');
	const words = buildWordlist();
	console.log('Writing wordlist to:', outputPath);
	fs.writeFileSync(outputPath, words.join('\n'), 'utf-8');
	const stats = fs.statSync(outputPath);
	console.log(`✓ Wordlist written successfully! Size: ${(stats.size / 1024).toFixed(2)} KB`);
}

main();
