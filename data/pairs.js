export const getAllPairs = () => {
	const methods = ['C', 'Y', 'S', 'N', 'P', 'B', 'L', 'R'];

	const pairs = [];

	for (let i = 0; i < methods.length; i++) {
		for (let j = 0; j < methods.length; j++) {
			if (i === j) continue; // Avoid plain leads

			pairs.push(methods[i] + methods[j]);
		}
	}

	return pairs;
};
