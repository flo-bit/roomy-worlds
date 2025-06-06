import { base } from '$app/paths';

export type Model = {
	path: string;
	collider: boolean;
	variants?: string[];
	colors?: string[];
	label: string;
	kit: string;
	canPlaceOnFloor?: boolean;
	noCollision?: boolean;
};

export const models: Model[] = [
	{
		path: 'Bush_1_{variant}_Color{color}',
		collider: false,
		variants: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
		colors: ['1', '2', '3', '4', '5', '6', '7', '8'],
		label: 'bush',
		kit: 'kaykit-forest-nature',
		noCollision: true
	},
	{
		path: 'Bush_2_{variant}_Color{color}',
		collider: false,
		variants: ['A', 'B', 'C', 'D', 'E', 'F'],
		colors: ['1', '2', '3', '4', '5', '6', '7', '8'],
		label: 'bush',
		kit: 'kaykit-forest-nature',
		noCollision: true
	},
	{
		path: 'Bush_3_{variant}_Color{color}',
		collider: false,
		variants: ['A', 'B', 'C'],
		colors: ['1', '2', '3', '4', '5', '6', '7', '8'],
		label: 'bush',
		kit: 'kaykit-forest-nature',
		noCollision: true
	},
	{
		path: 'Bush_4_{variant}_Color{color}',
		collider: false,
		variants: ['A', 'B', 'C', 'D', 'E', 'F'],
		colors: ['1', '2', '3', '4', '5', '6', '7', '8'],
		label: 'bush',
		kit: 'kaykit-forest-nature',
		noCollision: true
	},
	{
		path: 'Tree_1_{variant}_Color{color}',
		collider: true,
		variants: ['A', 'B', 'C'],
		colors: ['1', '2', '3', '4', '5', '6', '7', '8'],
		label: 'tree',
		kit: 'kaykit-forest-nature'
	},
	{
		path: 'Tree_2_{variant}_Color{color}',
		collider: true,
		variants: ['A', 'B', 'C'],
		colors: ['1', '2', '3', '4', '5', '6', '7', '8'],
		label: 'tree',
		kit: 'kaykit-forest-nature'
	},
	{
		path: 'Tree_3_{variant}_Color{color}',
		collider: true,
		variants: ['A', 'B', 'C'],
		colors: ['1', '2', '3', '4', '5', '6', '7', '8'],
		label: 'tree',
		kit: 'kaykit-forest-nature'
	},
	{
		path: 'Tree_4_{variant}_Color{color}',
		collider: true,
		variants: ['A', 'B', 'C'],
		colors: ['1', '2', '3', '4', '5', '6', '7', '8'],
		label: 'tree',
		kit: 'kaykit-forest-nature'
	},
	{
		path: 'Grass_1_{variant}_Color{color}',
		collider: true,
		variants: ['A', 'B', 'C', 'D'],
		colors: ['1', '2', '3', '4', '5', '6', '7', '8'],
		label: 'tree',
		kit: 'kaykit-forest-nature',
		noCollision: true
	},
	{
		path: 'Grass_2_{variant}_Color{color}',
		collider: true,
		variants: ['A', 'B', 'C', 'D'],
		colors: ['1', '2', '3', '4', '5', '6', '7', '8'],
		label: 'tree',
		kit: 'kaykit-forest-nature',
		noCollision: true
	},
	{
		path: 'Rock_1_{variant}_Color{color}',
		collider: true,
		variants: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q'],
		colors: ['1', '2', '3', '4', '5', '6', '7', '8'],
		label: 'tree',
		kit: 'kaykit-forest-nature'
	},
	{
		path: 'Rock_2_{variant}_Color{color}',
		collider: true,
		variants: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
		colors: ['1', '2', '3', '4', '5', '6', '7', '8'],
		label: 'tree',
		kit: 'kaykit-forest-nature'
	},
	{
		path: 'Rock_3_{variant}_Color{color}',
		collider: true,
		variants: [
			'A',
			'B',
			'C',
			'D',
			'E',
			'F',
			'G',
			'H',
			'I',
			'J',
			'K',
			'L',
			'M',
			'N',
			'O',
			'P',
			'Q',
			'R'
		],
		colors: ['1', '2', '3', '4', '5', '6', '7', '8'],
		label: 'tree',
		kit: 'kaykit-forest-nature'
	},
	{
		path: 'Tree_Bare_1_{variant}_Color{color}',
		collider: true,
		variants: ['A', 'B', 'C'],
		colors: ['1', '2', '3', '4', '5', '6', '7', '8'],
		label: 'tree',
		kit: 'kaykit-forest-nature'
	},
	{
		path: 'Tree_Bare_2_{variant}_Color{color}',
		collider: true,
		variants: ['A', 'B', 'C'],
		colors: ['1', '2', '3', '4', '5', '6', '7', '8'],
		label: 'tree',
		kit: 'kaykit-forest-nature'
	},
	{
		path: 'Hill_2x2x2_Color{color}',
		collider: true,
		colors: ['1', '2', '3', '4', '5', '6', '7', '8'],
		label: 'tree',
		kit: 'kaykit-forest-nature',
		canPlaceOnFloor: true
	},
	{
		path: 'Hill_2x2x4_Color{color}',
		collider: true,
		colors: ['1', '2', '3', '4', '5', '6', '7', '8'],
		label: 'tree',
		kit: 'kaykit-forest-nature',
		canPlaceOnFloor: true
	},
	{
		path: 'Hill_2x2x8_Color{color}',
		collider: true,
		colors: ['1', '2', '3', '4', '5', '6', '7', '8'],
		label: 'tree',
		kit: 'kaykit-forest-nature',
		canPlaceOnFloor: true
	},
	{
		path: 'Hill_4x2x2_Color{color}',
		collider: true,
		colors: ['1', '2', '3', '4', '5', '6', '7', '8'],
		label: 'tree',
		kit: 'kaykit-forest-nature',
		canPlaceOnFloor: true
	},
	{
		path: 'Hill_4x2x4_Color{color}',
		collider: true,
		colors: ['1', '2', '3', '4', '5', '6', '7', '8'],
		label: 'tree',
		kit: 'kaykit-forest-nature',
		canPlaceOnFloor: true
	},
	{
		path: 'Hill_4x2x8_Color{color}',
		collider: true,
		colors: ['1', '2', '3', '4', '5', '6', '7', '8'],
		label: 'tree',
		kit: 'kaykit-forest-nature',
		canPlaceOnFloor: true
	},
	{
		path: 'Hill_4x4x2_Color{color}',
		collider: true,
		colors: ['1', '2', '3', '4', '5', '6', '7', '8'],
		label: 'tree',
		kit: 'kaykit-forest-nature',
		canPlaceOnFloor: true
	},
	{
		path: 'Hill_4x4x4_Color{color}',
		collider: true,
		colors: ['1', '2', '3', '4', '5', '6', '7', '8'],
		label: 'tree',
		kit: 'kaykit-forest-nature',
		canPlaceOnFloor: true
	},
	{
		path: 'Hill_4x4x8_Color{color}',
		collider: true,
		colors: ['1', '2', '3', '4', '5', '6', '7', '8'],
		label: 'tree',
		kit: 'kaykit-forest-nature',
		canPlaceOnFloor: true
	},
	{
		path: 'Hill_8x4x2_Color{color}',
		collider: true,
		colors: ['1', '2', '3', '4', '5', '6', '7', '8'],
		label: 'tree',
		kit: 'kaykit-forest-nature',
		canPlaceOnFloor: true
	},
	{
		path: 'Hill_8x4x4_Color{color}',
		collider: true,
		colors: ['1', '2', '3', '4', '5', '6', '7', '8'],
		label: 'tree',
		kit: 'kaykit-forest-nature',
		canPlaceOnFloor: true
	},
	{
		path: 'Hill_8x4x8_Color{color}',
		collider: true,
		colors: ['1', '2', '3', '4', '5', '6', '7', '8'],
		label: 'tree',
		kit: 'kaykit-forest-nature',
		canPlaceOnFloor: true
	},
	{
		path: 'Hill_8x8x2_Color{color}',
		collider: true,
		colors: ['1', '2', '3', '4', '5', '6', '7', '8'],
		label: 'tree',
		kit: 'kaykit-forest-nature',
		canPlaceOnFloor: true
	},
	{
		path: 'Hill_8x8x4_Color{color}',
		collider: true,
		colors: ['1', '2', '3', '4', '5', '6', '7', '8'],
		label: 'tree',
		kit: 'kaykit-forest-nature',
		canPlaceOnFloor: true
	},
	{
		path: 'Hill_8x8x8_Color{color}',
		collider: true,
		colors: ['1', '2', '3', '4', '5', '6', '7', '8'],
		label: 'tree',
		kit: 'kaykit-forest-nature',
		canPlaceOnFloor: true
	},
	{
		path: 'Hill_12x6x2_Color{color}',
		collider: true,
		colors: ['1', '2', '3', '4', '5', '6', '7', '8'],
		label: 'tree',
		kit: 'kaykit-forest-nature',
		canPlaceOnFloor: true
	},
	{
		path: 'Hill_12x6x4_Color{color}',
		collider: true,
		colors: ['1', '2', '3', '4', '5', '6', '7', '8'],
		label: 'tree',
		kit: 'kaykit-forest-nature',
		canPlaceOnFloor: true
	},
	{
		path: 'Hill_12x6x8_Color{color}',
		collider: true,
		colors: ['1', '2', '3', '4', '5', '6', '7', '8'],
		label: 'tree',
		kit: 'kaykit-forest-nature',
		canPlaceOnFloor: true
	}
];

export function getPathsForModel(
	model: Model,
	specificVariant?: string,
	specificColor?: string
): string[] {
	let paths = [];
	if (model.variants && model.colors) {
		paths = model.variants
			.map((variant) =>
				model.colors?.map((color) => {
					return model.path
						.replace('{color}', specificColor ?? color)
						.replace('{variant}', specificVariant ?? variant);
				})
			)
			.flat();
	} else if (model.variants) {
		paths = model.variants.map((variant) => {
			return model.path.replace('{variant}', specificVariant ?? variant);
		});
	} else if (model.colors) {
		paths = model.colors.map((color) => {
			return model.path.replace('{color}', specificColor ?? color);
		});
	} else {
		paths = [model.path];
	}

	const uniquePaths = Array.from(new Set(paths));

	return uniquePaths.map((path) => {
		return `${base}/${model.kit}/${path}.gltf`;
	});
}
