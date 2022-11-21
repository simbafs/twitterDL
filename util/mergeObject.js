export default function mergeObject(from, to) {
	for (let i in from) {
		if (i in to) {
			to[i] = to[i].concat(from[i]);
		} else {
			to[i] = from[i];
		}
	}
}
