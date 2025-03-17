/**
 *
 * @param {Set} rows The set containing all rows
 */
export const scoreMusic = (rows) => {
	/** @type {string[]} */
	const rowArr = Array.from(rows);

	let score = 0;

	rowArr.forEach((r) => {
		// 56s
		if (r.startsWith('5678') || r.endsWith('5678')) {
			score += 1;
		}

		// CRUs
		const combinationRollUps = ['4578', '4678', '5678', '5478', '6478', '6578'];
		if (combinationRollUps.some((cru) => r.startsWith(cru) || r.endsWith(cru))) {
			score += 1;
		}

		// 4 Bell runs
		const fourBellRuns = ['1234', '2345', '3456', '4567', '5678', '8765', '7654', '6543', '5432', '4321'];

		if (fourBellRuns.some((run) => r.startsWith(run) || r.endsWith(run))) {
			score += 1;
		}

		// 5 Bell runs
		const fiveBellRuns = ['12345', '23456', '34567', '45678', '87654', '76543', '65432', '54321'];

		if (fiveBellRuns.some((run) => r.startsWith(run) || r.endsWith(run))) {
			score += 1;
		}

		// 6 Bell runs
		const sixBellRuns = ['123456', '234567', '345678', '876543', '765432', '654321'];

		if (sixBellRuns.some((run) => r.startsWith(run) || r.endsWith(run))) {
			score += 1;
		}

		// 7 Bell runs
		const sevenBellRuns = ['1234567', '2345678', '8765432', '7654321'];

		if (sevenBellRuns.some((run) => r.startsWith(run) || r.endsWith(run))) {
			score += 1;
		}

		// 5678 Combinations
		const bigBellCombos = ['5678', '6578', '8765'];

		if (bigBellCombos.some((c) => r.startsWith(c) || r.endsWith(c))) {
			score += 1;
		}

		// Near misses
		const nearMisses = [
			'12345687',
			'12345768',
			'12346578',
			'12354678',
			'12435678',
			'13245678',
			'21345678',
			'12346587',
			'12354768',
			'12435687',
			'12436578',
			'12436587',
			'13245768',
			'13254768',
			'21345687',
			'21346587',
			'21436587',
		];

		if (nearMisses.some((nm) => r === nm)) {
			score += 1;
		}

		// Named rows
		const namedRows = [
			'12345678', // Rounds
			'12563478', // Hagdyke
			'12753468', // Whittingtons
			'13245768', // Bowbells
			'13254768', // Priory
			'13527468', // Princesses
			'14327658', // Rollercoaster
			'16745238', // Jacks
			'17652438', // St Michael's
			'17654328', // Jokers
			'31247568', // Burdette
			'43215678', // See-saw
			'56781234', // Saw-see
			'45362718', // Exploding Tittums
			'65432178', // Reverse Waterfall
			'75321468', // Princes
			'87123456', // Waterfall
			'87654321', // Backrounds
			'13572468', // Queens
			'75312468', // Kings
			'15263748', // Tittums
		];

		if (namedRows.some((nr) => r === nr)) {
			score += 1;
		}

		// Combos from named rows

		// 1357s (Queens) ?? Not sure if this should check the start or the end
		if (r.startsWith('1357')) {
			score += 1;
		}

		const endNamedCombos = ['2468', '3468', '3478', '3578', '5768', '7468', '7568', '7658', '8765'];

		if (endNamedCombos.some((c) => r.endsWith(c))) {
			score += 1;
		}

		// Tittums-type
		if (r[1] === '5' && r[3] === '6' && r[4] === '7' && r[5] === '8') {
			score += 1;
		}
	});

	return score;
};
