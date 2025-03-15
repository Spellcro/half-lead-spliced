/**
 *
 * @param {Set} rows The set containing all rows
 */
export const scoreMusic = (rows) => {
	/** @type {string[]} */
	const rowArr = Array.from(rows);

	let score = 0;

	rowArr.forEach((r) => {
		// Named rows
		if (r === '87654321' || r === '13572468' || r === '15263748' || r === '75312468') {
			score += 2;
		}

		const backCombos = [
			'4578',
			'4678',
			'5478',
			'5678',
			'6478',
			'6578',
			'2468',
			'3478',
			'4321',
			'5432',
			'34567',
			'123456',
			'876543',
		];

		if (backCombos.some((c) => r.endsWith(c))) {
			score += 1;
		}

		const frontCombos = ['1357', '8765', '1234', '2345', '4321', '76543', '345678', '654321'];

		if (frontCombos.some((c) => r.indexOf(c) === 0)) {
			score += 1;
		}

		// Tittums-type
		if (r[1] === '5' && r[3] === '6' && r[4] === '7' && r[5] === '8') {
			score += 1;
		}
	});

	return score;
};
