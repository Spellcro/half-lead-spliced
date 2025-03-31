import { leadEndPermutations } from './data/pairs.js';
import { checkForTruth } from './validate-composition.js';

// const leads = Object.keys(leadEndPermutations);

const getInitialLeads = () => {
	const leads = [];
	const order = ['L', 'B', 'R', 'P', 'C', 'N', 'Y', 'S'];
	for (let i = 0; i < order.length; i++) {
		for (let j = 0; j < order.length; j++) {
			if (i === j) continue;

			leads.push(`${order[i]}${order[j]}`);
		}
	}

	return leads;
};

const leads = getInitialLeads();

function applyPermutation(state, permutation) {
	return permutation.map((i) => state[i - 1]);
}

function findSequence(startState, permutations, path = [], visited = new Set()) {
	const comp = path.map((i) => permutations[i]).join(' ');

	// If touch contains a lead without a change of method, return false
	const containsNoCom = ['C C', 'B B', 'N N', 'Y Y', 'S S', 'P P', 'L L', 'R R'].some((s) => comp.includes(s));

	if (containsNoCom) {
		return false;
	}

	// If touch is false, return false;
	if (comp.length && !checkForTruth(comp)) {
		return false;
	}

	if (path.length === permutations.length) {
		// Success condition: Final state must return to identity
		return JSON.stringify(startState) === JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8]);
	}

	for (let i = 0; i < permutations.length; i++) {
		if (path.includes(i)) continue; // Skip used permutations

		const newState = applyPermutation(startState, leadEndPermutations[permutations[i]].split(''));
		const stateKey = JSON.stringify(newState);

		if (!visited.has(stateKey)) {
			visited.add(stateKey);
			path.push(i);

			if (findSequence(newState, permutations, path, visited)) {
				return true; // Found a valid sequence
			}

			// Backtrack
			path.pop();
			visited.delete(stateKey);
		}
	}

	return false;
}

function shuffle(array) {
	let currentIndex = array.length;

	// While there remain elements to shuffle...
	while (currentIndex != 0) {
		// Pick a remaining element...
		let randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}

	return array;
}

const iterations = 100;

for (let i = 0; i < iterations; i++) {
	const rounds = [1, 2, 3, 4, 5, 6, 7, 8];
	const result = [];

	// Shuffle the order after the first iteration
	// const randomLeads = i === 0 ? [...leads] : shuffle([...leads]);
	const randomLeads = shuffle([...leads]);

	if (findSequence(rounds, randomLeads, result)) {
		const comp = result.map((i) => randomLeads[i]).join(' ');
		const [_, musicScore] = checkForTruth(comp);

		console.log(`${musicScore}: ${comp}`);
	}
}
