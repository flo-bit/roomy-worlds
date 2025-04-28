import { defComponent, LoroMap, LoroMovableList, type EntityIdStr } from '@muni-town/leaf';

export const TransformComponent = defComponent(
	'name:01JPEBV8TJ8YCXYYD256NJSR5X',
	LoroMap<{
		x: number;
		y: number;
		z: number;

		sx: number;
		sy: number;
		sz: number;

		qx: number;
		qy: number;
		qz: number;
		qw: number;
	}>
);

export const VoxelComponent = defComponent(
	'name:01JPEBV8TJ8YCXYYD256NJSR5X',
	LoroMap<{
		x: number;
		y: number;
		z: number;
		r: number;
		g: number;
		b: number;
		sx: number;
		sy: number;
		sz: number;
		qx: number;
		qy: number;
		qz: number;
		qw: number;

		visible: boolean;
		collider: boolean;
	}>
);

export const VoxelGroupComponent = defComponent(
	'voxels:02JPFMTA2QAFY2D3CV1C0YBZQ1',
	LoroMovableList<EntityIdStr>
);

export const TransformedGroupComponent = defComponent(
	'transformed:02JPFMTA2QAFY2D3CV1C0YBZQ1',
	LoroMap<{
		group: EntityIdStr;
	}>
);

export const ModelsComponent = defComponent(
	'models:02JPFMTA2QAFY2D3CV1C0YBZQ1',
	LoroMovableList<EntityIdStr>
);

export const WorldComponent = defComponent(
	'world:02JPFMTA2QAFY2D3CV1C0YBZQ1',
	LoroMovableList<EntityIdStr>
);

export const PlayerLocationsComponent = defComponent(
	'player:02JPFMTA2QAFY2D3CV1C0YBZQ1',
	LoroMovableList<EntityIdStr>
);

export const PlayerLocationComponent = defComponent(
	'player:02JPFMTA2QAFY2D3CV1C0YBZQ1',
	LoroMap<{
		x: number;
		y: number;
		z: number;

		time: number;
	}>
);
