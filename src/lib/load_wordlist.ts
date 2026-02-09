import wordlist_text from './assets/wordlist.txt?raw';

export default function load_wordlist(): string[] {
	const wordlist = wordlist_text.split('\n');
	// Remove first line which contains copyright info
	wordlist.shift();
	return wordlist;
}
