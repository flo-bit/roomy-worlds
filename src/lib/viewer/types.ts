import type { WorldSettings } from '$lib/roomy';

export type WorldData = {
	instances: {
		id: string;
		position: { x: number; y: number; z: number };
		quaternion: [number, number, number, number];
		scale: { x: number; y: number; z: number };

		model: string;
	}[];
	models: {
		[id: string]: {
			voxels: {
				id: string;
				position: { x: number; y: number; z: number };
				quaternion: [number, number, number, number];
				scale: { x: number; y: number; z: number };

				color: number;

				visible: boolean;

				collider: boolean;
			}[];
		};
	};
	settings: WorldSettings;
};
