import { placeNotation } from './data/place-notation.js';
import { scoreMusic } from './utils/music.utils.js';

/**
 * Takes a place notation string and returns an array
 * containing each change
 * @param {string} notation The place notation
 */
const splitPlaceNotationIntoChanges = (notation) => {
	const firstHalfChanges = [];
	const [leadNotation, leadEndChange] = notation.split(',');
	// split the 'lead' portion of the notation into each change

	for (let i = 0; i < leadNotation.length; i++) {
		const char = leadNotation.charAt(i);
		switch (char) {
			case '.':
				break;
			case '-':
				firstHalfChanges.push(char);
				break;
			default:
				// If the previous char was a number, append this char to the last string in the array. Else start a new array element
				if (i > 0 && !isNaN(parseInt(leadNotation.charAt(i - 1)))) {
					firstHalfChanges[firstHalfChanges.length - 1] += char;
				} else {
					firstHalfChanges.push(char);
				}
				break;
		}
	}

	// Mirror the array around the halflead
	const secondHalfChanges = firstHalfChanges.slice(0, -1).reverse();

	// Assemble the complete order of changes
	const finalChangeOrder = [...firstHalfChanges, ...secondHalfChanges, leadEndChange];

	return { full: finalChangeOrder, firstHalf: firstHalfChanges, secondHalf: secondHalfChanges, leadEnd: leadEndChange };
};

/**
 * @param {string[]} changes
 * @returns {Set<string>?}
 */
const validateChanges = (changes) => {
	const rounds = ['1', '2', '3', '4', '5', '6', '7', '8'];

	const rows = [rounds];

	const uniqueRows = new Set();

	for (let changeNumber = 0; changeNumber < changes.length; changeNumber++) {
		const change = changes[changeNumber];

		const uniqueRowCount = uniqueRows.size;
		const previousRow = rows[changeNumber];
		const nextRow = [];

		// Make places if the change is not a 'cross'
		if (change !== '-') {
			change.split('').forEach((place) => {
				const position = parseInt(place);
				nextRow[position - 1] = previousRow[position - 1];
			});
		}

		for (let i = previousRow.length - 1; i >= 0; i -= 1) {
			// If it already has a value ignore it
			// if it has a neigbour with no value switch it, else keep it as it was
			if (!nextRow[i]) {
				if (i > 0 && !nextRow[i - 1]) {
					nextRow[i] = previousRow[i - 1]; // need swapping
					nextRow[i - 1] = previousRow[i];
				} else {
					nextRow[i] = previousRow[i]; // forced places
				}
			}
		}

		rows.push(nextRow);

		uniqueRows.add(nextRow.join(''));

		if (uniqueRows.size === uniqueRowCount) {
			return null;
		}
	}

	return uniqueRows;
};

/**
 * Duplicates all elements in the array at the end of the existing array, n times
 * @template T
 * @param {T[]} arr The array to duplicate
 * @param {number} n Number of times to duplicate the array
 * @returns {T[]}
 */
const duplicateArray = (arr, n) => {
	return [].concat(...Array(n).fill(arr));
};

/**
 * Checks a composition (or an n-part composition) for truth
 * @param {string} composition
 * @param {number} parts
 * @returns {[Set<string>, number]?} A tuple of all the rows as a Set, and a music scores
 */
export const checkForTruth = (composition, parts = 1) => {
	const leadsInPart = composition.split(' ');

	const leads = duplicateArray(leadsInPart, parts);

	// Generate a full array of changes (in place notation format)
	const changes = [];

	leads.forEach((lead) => {
		// Handle First half, then second half
		const firstHalfMethod = lead[0];
		const secondHalfMethod = lead[1];

		const firstHalfPlaceNotation = placeNotation[firstHalfMethod];
		const secondHalfPlaceNotation = placeNotation[secondHalfMethod];

		const firstHalfChanges = splitPlaceNotationIntoChanges(firstHalfPlaceNotation).firstHalf;
		const secondMethodChanges = splitPlaceNotationIntoChanges(secondHalfPlaceNotation);

		const secondHalfChanges = secondMethodChanges.secondHalf;

		const call = lead[2];

		if (call === '.') {
			secondHalfChanges.push('14');
		} else if (call === 's') {
			secondHalfChanges.push('1234');
		} else {
			secondHalfChanges.push(secondMethodChanges.leadEnd);
		}

		changes.push(...firstHalfChanges, ...secondHalfChanges);
	});

	// Execute each change and check it is unique
	const rows = validateChanges(changes);

	if (!rows) {
		return null;
	}

	// Score music?
	return [rows, scoreMusic(rows)];
};
