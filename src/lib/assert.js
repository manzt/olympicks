/**
 * Error thrown when an assertion fails.
 */
export class AssertionError extends Error {
	/** @param {string} message The error message. */
	constructor(message) {
		super(message);
		this.name = "AssertionError";
	}
}

/**
 * Make an assertion. An error is thrown if `expr` does not have truthy value.
 *
 * @param {unknown} expr The expression to test.
 * @param {string} [msg] The message to display if the assertion fails.
 * @returns {asserts expr}
 */
export function assert(expr, msg = "") {
	if (!expr) {
		throw new AssertionError(msg);
	}
}
