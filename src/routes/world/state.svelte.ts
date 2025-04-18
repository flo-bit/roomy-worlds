import type { EntityIdStr } from '@muni-town/leaf';
import type { Vector3 } from 'three';

type Item = {
	position: [number, number, number];
	color: [number, number, number];
	quaternion: [number, number, number, number];
	scale: [number, number, number];
};

export const items: Item[] = $state([]);

export function addObject(importObj: unknown) {
	items.push(
		...(importObj as {
			position: [number, number, number];
			color: [number, number, number];
			quaternion: [number, number, number, number];
			scale: [number, number, number];
		}[])
	);
}

export const editingState = $state({
	selectedId: null as EntityIdStr | null
});

export function openFile() {
	const file = document.createElement('input');
	file.type = 'file';
	file.accept = '.json';
	file.onchange = (e) => {
		// @ts-expect-error - file input
		if (!e.target?.files) {
			console.error('no files found');
			return;
		}
		// @ts-expect-error - file input
		const file = e.target.files[0];
		const reader = new FileReader();
		reader.onload = (e) => {
			if (!e.target?.result) {
				console.error('no result found');
				return;
			}

			const json = JSON.parse(e.target.result as string);
			addObject(json);
		};
		reader.readAsText(file);
	};
	file.click();
}

export type AddInstanceFunction = (id: EntityIdStr, position: Vector3) => void;
