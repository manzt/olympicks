export function groupBy<T>(
	iterable: Iterable<T>,
	keySelector: (item: T) => string,
): Map<string, T[]> {
	let map = new Map<string, T[]>();
	for (let item of iterable) {
		let key = keySelector(item);
		if (!map.has(key)) {
			map.set(key, []);
		}
		// biome-ignore lint/style/noNonNullAssertion: ok we just checked
		map.get(key)!.push(item);
	}
	return map;
}
