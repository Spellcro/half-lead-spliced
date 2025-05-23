const perms = {
	bristol: '24365871',
	cambridge: '74256831',
	lincolnshire: '47256831',
	london: '42637851',
	pudsey: '68254731',
	rutland: '72458361',
	superlative: '68472531',
	yorkshire: '68472531',
	// lessness: '63427581'
};

type Method = keyof typeof perms;

const rounds = ['1', '2', '3', '4', '5', '6', '7', '8'];

const isRounds = (row: string[]) => {
	return row.join('') === '12345678';
};

const permute = (row: string[], permutation: string) => {
	const permutedRow = ['0', '0', '0', '0', '0', '0', '0', '0'];
	permutation.split('').forEach((char, index) => {
		const num = Number(char);
		permutedRow[index] = row[num - 1];
	});
	return permutedRow;
};

const generateRandomComposition = (numberOfLeads = 8, changeEveryLead = true) => {
	const availableMethods = Object.keys(perms) as Method[];
	const numberOfMethods = availableMethods.length;
	const composition: Method[] = [];
	let previousNumber = -1;
	for (let i = 0; i < numberOfLeads; i += 1) {
		let randomNumber = Math.floor(Math.random() * numberOfMethods);
		if (changeEveryLead && randomNumber === previousNumber) {
			const additionalValue = Math.floor(Math.random() * (numberOfMethods - 2) + 1);
			randomNumber = (((randomNumber + additionalValue) % numberOfMethods) + numberOfMethods) % numberOfMethods; // ((a % b) + b) % b
		}
		composition.push(availableMethods[randomNumber]);
		previousNumber = randomNumber;
	}

	let bellOrder = ['1', '2', '3', '4', '5', '6', '7', '8'];

	const methodsRung: Method[] = [];

	composition.forEach((method) => {
		bellOrder = permute(bellOrder, perms[method]);
		methodsRung.push(method);
	});
	if (isRounds(bellOrder)) {
		console.log('Found rounds: ', methodsRung);
	}
};

// const generateCourse = (startingOrder: string[], methodsRungSoFar?: Method[]): [string[], Method[]] => {
// 	let bellOrder = startingOrder || ['1', '2', '3', '4', '5', '6', '7', '8'];

// 	const composition: Method[] = (Object.keys(perms) as Method[]).sort((_a, _b) => {
// 		const randomNumberA = Math.random();
// 		const randomNumberB = Math.random();

// 		return randomNumberA - randomNumberB;
// 	});

// 	const methodsRung: Method[] = methodsRungSoFar ? [...methodsRungSoFar] : [];

// 	composition.forEach((method) => {
// 		bellOrder = permute(bellOrder, perms[method]);
// 		methodsRung.push(method);

// 		if (isRounds(bellOrder)) {
// 			console.log('Found rounds: ', methodsRung);
// 		}
// 	});

// 	return [bellOrder, methodsRung];
// };

// /* Find compositions from 8 to 16 methods long */
// const generateComposition = () => {
// 	let [partEnd, methodsRung] = generateCourse(rounds);
// 	if (!isRounds(partEnd)) {
// 		[partEnd, methodsRung] = generateCourse(partEnd, methodsRung);
// 	}
// };

/* Randomly generates compositions of atleast the standard 8
 * and check if they come round. Logs to STDOUT if a solution is found.
 */
const checkForCompositions = ({
	iterations,
	numberOfLeads,
	changeEveryLead,
}: {
	iterations: number;
	changeEveryLead: boolean;
	numberOfLeads: number;
}) => {
	for (let i = 0; i < iterations; i++) {
		generateRandomComposition(numberOfLeads, changeEveryLead);
	}
};

checkForCompositions({
	iterations: 100000,
	numberOfLeads: 9,
	changeEveryLead: true,
});

const doesCompositionComeRound = (composition: Method[]) => {
	const leadEnds: string[][] = [];
	let bellOrder = ['1', '2', '3', '4', '5', '6', '7', '8'];
	composition.forEach((method) => {
		bellOrder = permute(bellOrder, perms[method]);
		leadEnds.push(bellOrder);
	});

	console.log(leadEnds);
	return isRounds(bellOrder);
};

/**
 *  Found solutions:
 *  YNLRSCBP RBS ["yorkshire", "lincolnshire", "london", "rutland", "superlative", "cambridge", "bristol", "pudsey", "rutland", "bristol", "superlative"]
 *  LNRPCYBS SYLCBP ["london", "lincolnshire", "rutland", "pudsey", "cambridge", "yorkshire", "bristol", "superlative", "superlative", "yorkshire", "london", "cambridge", "bristol", "pudsey"]
 *  SNCYRPLB LCSRBYPN ["superlative", "lincolnshire", "cambridge", "yorkshire", "rutland", "pudsey", "london", "bristol", "london", "cambridge", "superlative", "rutland", "bristol", "yorkshire", "pudsey", "lincolnshire"]
 *  RBLYPSCN BCRPLNYS ["rutland", "bristol", "london", "yorkshire", "pudsey", "superlative", "cambridge", "lincolnshire", "bristol", "cambridge", "rutland", "pudsey", "lincolnshire", "london", "yorkshire", "superlative"]
 *  LPBCNSRY LPYBC ["london", "pudsey", "bristol", "cambridge", "lincolnshire", "superlative", "rutland", "yorkshire", "london", "pudsey", "yorkshire", "bristol", "cambridge"]
 *  RSCBYNPL N ["rutland", "superlative", "cambridge", "bristol", "yorkshire", "lincolnshire", "pudsey", "london", "lincolnshire"]
 */

/**
 * 2 Parts:
 * NRLSCYPB ['lincolnshire', 'rutland', 'london', 'superlative', 'cambridge', 'yorkshire', 'pudsey', 'bristol']
 *
 * ['4', '3', '2', '1', '5', '6', '7', '8']
 * ['london', 'pudsey', 'rutland', 'bristol', 'lincolnshire', 'superlative', 'yorkshire', 'cambridge']
 *
 * ['2', '1', '4', '3', '5', '6', '7', '8']
 * ['rutland', 'bristol', 'yorkshire', 'superlative', 'london', 'lincolnshire', 'pudsey', 'cambridge']
 * ['lincolnshire', 'rutland', 'london', 'superlative', 'cambridge', 'yorkshire', 'pudsey', 'bristol']
 *
 * ['3', '4', '1', '2', '5', '6', '7', '8']
 * ['london', 'yorkshire', 'superlative', 'rutland', 'pudsey', 'cambridge', 'bristol', 'lincolnshire']
 */

// doesCompositionComeRound(['london', 'pudsey', 'rutland', 'bristol', 'lincolnshire', 'superlative', 'yorkshire', 'cambridge']);
