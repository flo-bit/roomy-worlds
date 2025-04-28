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

import { g, initRoomy } from './roomy.svelte';
import { goto } from '$app/navigation';
import { World } from './roomy';
import { editingState } from './world-editor/state.svelte';

export async function createWorld(base: string) {
	if (!g.roomy) {
		await initRoomy();

		if (!g.roomy) return;
	}
	const world = await g.roomy.create(World);

	world.settings = {
		seed: Math.random().toString(),
		size: 100,
		terrainGradient: [
			{ rgb: { r: 0, g: 0.05, b: 0 }, position: 0 },
			{ rgb: { r: 0, g: 0.35, b: 0 }, position: 1 }
		],
		waterGradient: [
			{ rgb: { r: 0.0, g: 0.0, b: 0.05 }, position: 0 },
			{ rgb: { r: 0.1, g: 0.1, b: 0.55 }, position: 1 }
		],
		waterPercentage: 35,
		version: 1
	};

	world.commit();

	editingState.showWorldSettings = true;

	goto(base + `/world?id=${world.id}`);
}

export function shuffle<T>(array: T[]): T[] {
	let currentIndex = array.length;

	// While there remain elements to shuffle...
	while (currentIndex != 0) {
		// Pick a remaining element...
		const randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}
	return array;
}
