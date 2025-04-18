/**
 * Helper that allows you to do something similar to the `$derive` rune but for a function returning
 * a promise.
 *
 * @param default_value The initial value to set the reactive state to before the promise has
 * resolved.
 * @param get A reactive closure that returns a promise with the target value. This will be re-run
 * if any reactive state that it depends on has changed, just like `$derive`.
 * */
export function derivePromise<T>(
	default_value: T,
	get: () => Promise<T>
): {
	/** Accessor for the inner, reactive value. */
	value: T;
} {
	const state = $state({ value: default_value });
	$effect(() => {
		get().then((v) => {
			state.value = v;
		});
	});
	return state;
}
