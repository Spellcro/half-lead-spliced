/**
 * CONFIGURATION for touch generation
 */
export const CONFIG = {
	// Number of full leads to generate. Output will occur early if rounds comes up before this amount. Default: 8
	numberOfLeads: 8,

	// Add a minimum length of touch to output. Set to numberOfLeads to force a specific touch length. Default: 4
	minimumLength: 4,

	// If the program should validate for truth. Currently breaks with half-lead calls. Default: true
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

	// The chance (0 to 1 inclusive) of including a call at any given lead. Used to weight number of calls in a touch.
	// Set to 0 to disable lead end calls. Default: 0.25
	chanceOfCall: 0.25,

	// Configuration for multipart touches. Default: parts=1, partEnd='12345678'
	parts: 1,
	partEnd: '12345678',
};

// To limit the method set, manually comment out any methods below that you wish to exclude
export const firstHalfLeadsPlain = {
	Y1: '68472531', // Yorkshire
	S1: '68472531', // Superlative
	C1: '74256831', // Cambridge
	N1: '47256831', // Lincolnshire
	P1: '68254731', // Pudsey
	B1: '24365871', // Bristol
	R1: '72458361', // Rutland
	L1: '42637851', // London
};

export const firstHalfLeadsBobs = {
	'Y1.': '68475321', // Yorkshire
	'S1.': '68475321', // Superlative
	'C1.': '74258361', // Cambridge
	'N1.': '47258361', // Lincolnshire
	'P1.': '68257341', // Pudsey
	'B1.': '32546871', // Bristol
	'R1.': '47825361', // Rutland
};

export const firstHalfLeadsSingles = {
	Y1s: '68475231', // Yorkshire
	S1s: '68475231', // Superlative
	C1s: '74258631', // Cambridge
	N1s: '47258631', // Lincolnshire
	P1s: '68257431', // Pudsey
	B1s: '32546781', // Bristol
	R1s: '47825631', // Rutland
	L1s: '42637581', // London
};

export const secondHalfLeads = {
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
