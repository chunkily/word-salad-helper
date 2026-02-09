import load_wordlist from '$lib/load_wordlist';

export function load() {
	const wordlist = load_wordlist();

	return {
		wordlist
	};
}
