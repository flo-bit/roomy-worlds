import type { AddVoxelFunction } from './types';

export function downloadObjectAsJson(exportObj: unknown, exportName: string) {
	const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObj));
	const downloadAnchorNode = document.createElement('a');
	downloadAnchorNode.setAttribute('href', dataStr);
	downloadAnchorNode.setAttribute('download', exportName + '.json');
	document.body.appendChild(downloadAnchorNode);
	downloadAnchorNode.click();
	downloadAnchorNode.remove();
}

export function importObjectFromJson(importObj: unknown, addVoxel: AddVoxelFunction) {
	const voxels = importObj as {
		position: [number, number, number];
		color: [number, number, number];
		quaternion: [number, number, number, number];
		scale: [number, number, number];
		visible: boolean;
		collider: boolean;
	}[];

	for (const voxel of voxels) {
		addVoxel(voxel.position, voxel.color, voxel.scale, voxel.quaternion);
	}
}

export function loadVoxelFromJson(addVoxel: AddVoxelFunction) {
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
			importObjectFromJson(json, addVoxel);
		};
		reader.readAsText(file);
	};
	file.click();
}
