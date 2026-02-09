/** Returns the minimum and maximum lengths of the given words. */
export default function minmaxLengths(words: string[] | (() => string[])): {
	min: number;
	max: number;
} {
	if (typeof words === 'function') {
		words = words();
	}
	let min = words[0].length;
	let max = words[0].length;

	for (const word of words) {
		if (word.length < min) {
			min = word.length;
		}
		if (word.length > max) {
			max = word.length;
		}
	}

	return { min, max };
}
