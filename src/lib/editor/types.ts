export type AddVoxelFunction = (
	position: [number, number, number],
	color: [number, number, number],
	scale?: [number, number, number],
	quaternion?: [number, number, number, number]
) => void;
