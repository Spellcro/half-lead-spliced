import { checkForTruth } from './validate-composition.js';

/**
 * CONFIGURATION for touch generation
 */
const CONFIG = {
	// Number of full leads to generate. Output will occur early if rounds comes up before this amount. Default: 8
	numberOfLeads: 8,

	// Add a minimum length of touch to output. Set to numberOfLeads to force a specific touch length. Default: 4
	minimumLength: 4,

	// If the program should validate for truth. Default: true
	checkForTruth: true,

	// An array of methods to include. Touch will not be logged unless all mentioned methods are involved.
	// Checks for substrings of the method keys, so e.g 'B', 'B1', 'B1s' will all work. Default: []
	/** @type {string[]} */
	includeMethods: [],

	// Force the touch to use the same "second half" method. Default: false
	useSameSecondHalf: false,

	// Include half-lead bobs and singles. Default: false
	useHalfLeadCalls: false,

	// Number of compositions to attempt to generate. Try increasing if compositions are not found. Default: 100000
	iterations: 100000,

	// Max bobs/singles in a touch. Will not output any touch with more calls than this (at any position).
	// Set to any negative number to disable. Default: 2
	maxCalls: 2,

	// Configuration for multipart touches
	parts: 1,
	partEnd: '12345678',
};

// To limit the method set, manually comment out any methods below that you wish to exclude
const firstHalfLeadsPlain = {
	Y1: '68472531', // Yorkshire
	S1: '68472531', // Superlative
	C1: '74256831', // Cambridge
	N1: '47256831', // Lincolnshire
	P1: '68254731', // Pudsey
	B1: '24365871', // Bristol
	R1: '72458361', // Rutland
	L1: '42637851', // London
	G1: '25374681', // Glasgow
};

const firstHalfLeadsBobs = {
	'Y1.': '68475321', // Yorkshire
	'S1.': '68475321', // Superlative
	'C1.': '74258361', // Cambridge
	'N1.': '47258361', // Lincolnshire
	'P1.': '68257341', // Pudsey
	'B1.': '32546871', // Bristol
	'R1.': '47825361', // Rutland
};

const firstHalfLeadsSingles = {
	Y1s: '68475231', // Yorkshire
	S1s: '68475231', // Superlative
	C1s: '74258631', // Cambridge
	N1s: '47258631', // Lincolnshire
	P1s: '68257431', // Pudsey
	B1s: '32546781', // Bristol
	R1s: '47825631', // Rutland
	L1s: '42637581', // London
};

const secondHalfLeads = {
	// Yorkshire
	Y2: '86472513',
	'Y2.': '87642513',
	Y2s: '86742513',

	// Superlative
	S2: '86472513',
	'S2.': '87642513',
	S2s: '86742513',

	// Cambridge
	C2: '84176352',
	'C2.': '87416352',
	C2s: '84716352',

	// Lincolnshire
	N2: '84276351',
	'N2.': '87426351',
	N2s: '84726351',

	// Pudsey
	P2: '84672315',
	'P2.': '87462315',
	P2s: '84762315',

	// Bristol
	B2: '82143657',
	'B2.': '82135476',
	B2s: '81235476',

	// Rutland
	R2: '83276541',
	'R2.': '87326541',
	R2s: '83726541',

	// London
	L2: '81234675',
	'L2.': '83124675',
	L2s: '81324675',
};

/**
 * END OF CONFIGURATION
 */

// Destructure config items
const { numberOfLeads, minimumLength, useSameSecondHalf, iterations, useHalfLeadCalls, maxCalls } = CONFIG;

const getFirstHalfLeads = () => {
	let final = { ...firstHalfLeadsPlain };

	if (useHalfLeadCalls) {
		final = { ...final, ...firstHalfLeadsBobs, ...firstHalfLeadsSingles };
	}

	return final;
};

const firstHalfLeads = getFirstHalfLeads();

const includeMethods = CONFIG.includeMethods || [];

// Combine permutations into one big set
const allPermutations = { ...firstHalfLeads, ...secondHalfLeads };

// Data variables containing available methods
const firstHalfLeadMethods = Object.keys(firstHalfLeads);
const secondHalfLeadMethods = Object.keys(secondHalfLeads);

const numberOfFirstHalves = firstHalfLeadMethods.length;
const numberOfSecondHalves = secondHalfLeadMethods.length;

/**
 * @param {string[]} row
 */
const isRounds = (row) => {
	return row.join('') === (CONFIG.partEnd || '12345678');
};

/**
 * Converts a composition array into a format useful for outputting
 * @param {string[]} methodsRung
 */
const formatForPrint = (methodsRung) => {
	let str = '';

	methodsRung.forEach((m, index) => {
		const removeNumbers = Array.from(m).filter((c) => isNaN(Number(c)));

		str += removeNumbers.join('');

		const isSecondHalf = index % 2 !== 0;
		if (isSecondHalf) {
			str += ' ';
		}
	});

	return str.trim();
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

/**
 * Checks that all "required methods" were included in the composition,
 * accounting for calls and different parts of the lead
 * @param {string[]} composition
 * @param {string[]} includeMethods
 */
const checkIncludeMethods = (composition, includeMethods) => {
	if (!includeMethods.length) {
		return true;
	}

	// Every required method in includeMethods must be a substring of
	// at least one half-lead in the composition
	return includeMethods.every((requiredMethod) => {
		return composition.some((method) => method.includes(requiredMethod));
	});
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

	const calls = composition
		.join(' ')
		.split('')
		.filter((c) => c === 's' || c === '.');
	if (maxCalls >= 0 && calls.length > maxCalls) {
		return;
	}

	// Iterate through each lead of the composition, to see if it comes round
	let bellOrder = ['1', '2', '3', '4', '5', '6', '7', '8'];

	const leadEnds = new Set();

	const methodsRung = [];

	let roundsFound = false;
	let step = 0;

	while (!roundsFound && step < composition.length) {
		const method = composition[step];
		bellOrder = permute(bellOrder, allPermutations[method]);
		methodsRung.push(method);

		// If we hit a duplicate change, there is no reason to continue
		const row = bellOrder.join('');
		leadEnds.add(row);

		if (leadEnds.size <= step) {
			break;
		}

		roundsFound = isRounds(bellOrder);

		step += 1;
	}

	const containsAllDesired = checkIncludeMethods(methodsRung, includeMethods);

	const leadsRung = methodsRung.length / 2;

	if (roundsFound && containsAllDesired && leadsRung >= minimumLength) {
		const formattedComposition = formatForPrint(methodsRung);

		if (!CONFIG.checkForTruth || checkForTruth(formattedComposition, CONFIG.parts)) {
			console.log('Found rounds: ', formattedComposition);
		}
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

const validateConfiguration = () => {
	const allMethods = Object.keys(allPermutations);

	// Check that `includeMethods` does not have an invalid configuration which would result in nothing being logged
	const invalidIncludes = includeMethods.filter((m) => !allMethods.some((key) => key.includes(m)));

	if (invalidIncludes.length) {
		const includeString = invalidIncludes.join(', ');
		throw new Error(
			`Invalid includeMethods configuration. The following methods are missing from the available methods list, but requested by the includeMethods config: ${includeString}`
		);
	}

	// Check that the part end configuration is valid
	const partEnds = new Set();

	let partEnd = ['1', '2', '3', '4', '5', '6', '7', '8'];

	for (let part = 1; part <= CONFIG.parts; part++) {
		partEnd = permute(partEnd, CONFIG.partEnd);

		partEnds.add(partEnd.join(''));

		if (partEnds.size < part) {
			throw new Error(`Invalid parts/partEnd configuration. Duplicate part ends appear before all parts are rung`);
		}
	}

	if (partEnd.join('') !== '12345678') {
		throw new Error(`Invalid parts/partEnd configuration. Rounds is not reached after ${CONFIG.parts} parts.`);
	}
};

console.time(`Checked ${iterations} iterations in`);

// Validate the CONFIG object before proceeding with generation
validateConfiguration();

// Execute the composition "search"
checkForCompositions();

console.timeEnd(`Checked ${iterations} iterations in`);
