/**
 * CONFIGURATION for touch generation
 */
const CONFIG = {
	// Number of leads (first half + second half) to generate. Output will occur early if rounds comes up before this amount. Default: 8
	numberOfLeads: 8,

	// Add a minimum length of touch to output. Set to numberOfLeads to force a touch length. Default: 4
	minimumLength: 4,

	// Force the touch to use the same "second half" method. Default: false
	useSameSecondHalf: true,

	// (Currently unsupported) Include bobs. Default: false
	useBobs: false,

	// (Currently unsupported) Include singles. Default: false
	useSingles: false,

	// Number of compositions to attempt to generate. Try increasing if compositions are not found. Default: 100000
	iterations: 100000,
};

// To limit the method set, comment out any methods below that you wish to exclude
const firstHalfLeads = {
	Y1: '68472531', // Yorkshire
	S1: '68472531', // Superlative
	C1: '74256831', // Cambridge
	N1: '47256831', // Lincolnshire
	P1: '68254731', // Pudsey
	B1: '24365871', // Bristol
	R1: '72458361', // Rutland
	L1: '42637851', // London
};

const secondHalfLeads = {
	Y2: '86472513', // Yorkshire
	S2: '86472513', // Superlative
	C2: '84176352', // Cambridge
	N2: '84276351', // Lincolnshire
	P2: '84672315', // Pudsey
	B2: '82143657', // Bristol
	R2: '83276541', // Rutland
	L2: '81234675', // London
};

/**
 * END OF CONFIGURATION
 */

// Destructure config items
const { numberOfLeads, minimumLength, useSameSecondHalf, iterations } = CONFIG;

// Combine permutations into one big set
const allPermutations = { ...firstHalfLeads, ...secondHalfLeads };

// Data variables containing available methods
const firstHalfLeadMethods = Object.keys(firstHalfLeads);
const secondHalfLeadMethods = Object.keys(secondHalfLeads);

const numberOfFirstHalves = firstHalfLeadMethods.length;
const numberOfSecondHalves = secondHalfLeadMethods.length;

/**
 * @param{string[]} row
 */
const isRounds = (row) => {
	return row.join('') === '12345678';
};

/**
 * Converts a composition array into a format useful for outputting
 * @param {string[]} methodsRung
 */
const formatForPrint = (methodsRung) => {
	let str = '';

	methodsRung.forEach((m) => {
		str += m;
		const finalChar = m[m.length - 1];
		const hasCall = finalChar === '.' || finalChar === 's';
		const separator = hasCall ? '' : ' ';
		str += separator;
	});

	return str;
};

/**
 * Permutes the provided row (order of bells)
 * @param {string[]} row
 * @param {string} permutation
 * @returns {string[]}
 */
const permute = (row, permutation) => {
	const permutedRow = ['0', '0', '0', '0', '0', '0', '0', '0'];
	permutation.split('').forEach((char, index) => {
		const num = Number(char);
		permutedRow[index] = row[num - 1];
	});
	return permutedRow;
};

/**
 * Selects a different random number to the current chosen one, by
 * generating a new random number from 1 to (maximum - 1) and adding that,
 * then taking the modulus to bring it back into the required range
 * @param {number} randomNumber The existing random number
 * @param {number} maximum The maximum random number we can choose
 */
const pickDifferentNumber = (randomNumber, maximum) => {
	const additionalValue = Math.floor(Math.random() * (maximum - 2) + 1);

	// Modulo ensures we don't go out of bounds: ((a % b) + b) % b
	const newNumber = (((randomNumber + additionalValue) % maximum) + maximum) % maximum;

	return newNumber;
};

const generateRandomComposition = () => {
	// Generate a fixed second half, in case requested based on CONFIG values
	const fixedSecondHalf = Math.floor(Math.random() * numberOfSecondHalves);

	// Randomly generate a composition from our available methods
	const composition = [];

	for (let i = 0; i < numberOfLeads; i += 1) {
		// Add a first half lead
		const firstHalf = Math.floor(Math.random() * numberOfFirstHalves);
		composition.push(firstHalfLeadMethods[firstHalf]);

		// Add a second half lead
		const secondHalf = useSameSecondHalf ? fixedSecondHalf : Math.floor(Math.random() * numberOfSecondHalves);
		composition.push(secondHalfLeadMethods[secondHalf]);
	}

	// Iterate through each lead of the composition, to see if it comes round
	let bellOrder = ['1', '2', '3', '4', '5', '6', '7', '8'];

	const methodsRung = [];

	let roundsFound = false;
	let step = 0;

	while (!roundsFound && step < composition.length) {
		const method = composition[step];
		bellOrder = permute(bellOrder, allPermutations[method]);
		methodsRung.push(method);
		roundsFound = isRounds(bellOrder);
		step += 1;
	}

	const leadsRung = methodsRung.length / 2;

	if (roundsFound && leadsRung >= minimumLength) {
		console.log('Found rounds: ', formatForPrint(methodsRung));
	}
};

/**
 * Generates random compositions `iterations` number of times
 */
const checkForCompositions = () => {
	for (let i = 0; i < iterations; i++) {
		generateRandomComposition();
	}
};

/**
 * Execute the composition "search"
 */
checkForCompositions();
