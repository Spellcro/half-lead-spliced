/**
 *
 * @param {Set} rows The set containing all rows
 */
export const scoreMusic = (rows) => {
	const rowArr = Array.from(rows);

	let score = 0;

	rowArr.forEach((r) => {
		// Named rows
		if (r === '87654321' || r === '13572468' || r === '15263748' || r === '45362718' || r === '75312468') {
			score += 4;
		}

		// Big bells on the front
		if (r[0] === '8' && r[1] === '7' && r[2] === '6') {
			score += r[3] === '5' ? 2 : 1;
		}

		// Big bells at the back
		if (r[7] === '8' && r[6] === '7' && r[5] === '6') {
			score += r[4] === '5' ? 2 : 1;
		}

		// Little bells off the front
		if (r[0] === '2' && r[1] === '3' && r[2] === '4') {
			score += r[3] === '5' ? 2 : 1;
		}

		// Little bells at the back
		if (r[7] === '2' && r[6] === '3' && r[5] === '4') {
			score += r[4] === '5' ? 2 : 1;
		}

		if (r[7] === '1' && r[6] === '2' && r[5] === '3') {
			score += r[4] === '4' ? 1 : 0.5;
		}
	});

	return score;
};
