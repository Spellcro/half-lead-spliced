import { checkForTruth } from './validate-composition.js';
import {
	CONFIG,
	firstHalfLeadsPlain,
	firstHalfLeadsBobs,
	firstHalfLeadsSingles,
	secondHalfLeads,
} from './configuration.js';

// Destructure config items
const { numberOfLeads, minimumLength, useSameSecondHalf, iterations, useHalfLeadCalls, maxCalls, minimumScore } =
	CONFIG;

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

const secondHalfLeadsPlain = secondHalfLeadMethods.filter((m) => !m.includes('s') && !m.includes('.'));
const secondHalfLeadsCalls = secondHalfLeadMethods.filter((m) => !secondHalfLeadsPlain.includes(m));

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

	let previousSecondHalf = '';

	let callsCount = 0;

	for (let i = 0; i < numberOfLeads; i += 1) {
		// Add a first half lead, different to the previous one
		let firstHalf = Math.floor(Math.random() * numberOfFirstHalves);

		// Avoid a missing change of method at the lead end
		const isSameAsPreviousSecondHalf = firstHalfLeadMethods[firstHalf][0] === previousSecondHalf[0];

		if (isSameAsPreviousSecondHalf) {
			firstHalf = pickDifferentNumber(firstHalf, numberOfFirstHalves);
		}

		const firstHalfMethod = firstHalfLeadMethods[firstHalf];

		// Add the first half to the composition
		composition.push(firstHalfMethod);

		if (useSameSecondHalf) {
			composition.push(secondHalfLeadMethods[fixedSecondHalf]);
			continue;
		}

		// Add a second half lead, weighted against not including calls
		const useCall = (maxCalls < 0 || callsCount < maxCalls) && Math.random() < CONFIG.chanceOfCall;

		if (useCall) callsCount += 1;

		const methodSet = useCall ? secondHalfLeadsCalls : secondHalfLeadsPlain;

		let secondHalf = Math.floor(Math.random() * methodSet.length);
		const isSameAsFirstHalf = methodSet[secondHalf][0] === firstHalfMethod[0];

		if (isSameAsFirstHalf) {
			secondHalf = pickDifferentNumber(secondHalf, methodSet.length);
		}

		const secondHalfMethod = methodSet[secondHalf];

		previousSecondHalf = secondHalfMethod;

		composition.push(secondHalfMethod);
	}

	// Iterate through each half-lead of the composition, to see if it comes round
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

		if (!CONFIG.checkForTruth) {
			console.log('Found rounds: ', formattedComposition);
			return;
		}

		const result = checkForTruth(formattedComposition, CONFIG.parts);

		if (!result) {
			return;
		}

		const [rows, score] = result;

		if (score < minimumScore) {
			return;
		}

		const namedRows = [];

		if (rows.has('13572468')) {
			namedRows.push('Q');
		}

		if (rows.has('15263748')) {
			namedRows.push('T');
		}

		if (rows.has('75312468')) {
			namedRows.push('K');
		}

		if (rows.has('87654321')) {
			namedRows.push('B');
		}

		if (rows.has('14327658')) {
			namedRows.push('R');
		}

		if (rows.has('45362718')) {
			namedRows.push('E');
		}

		console.log(`Found: ${score} score (${namedRows.length ? namedRows.join('') : '-'}): `, formattedComposition);

		return formattedComposition;
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
	if (useHalfLeadCalls && CONFIG.checkForTruth) {
		throw new Error('Invalid configuration: `checkForTruth` is not currently supported when using half lead calls.');
	}

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

console.log(`Searching for a ${CONFIG.parts}-part composition with part-end ${CONFIG.partEnd}.`);

// Validate the CONFIG object before proceeding with generation
validateConfiguration();

// Execute the composition "search"
checkForCompositions();

console.timeEnd(`Checked ${iterations} iterations in`);
