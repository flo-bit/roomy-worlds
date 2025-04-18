<script lang="ts">
	import type { Voxel } from '$lib/shared/components';
	import ModelPicker from '../base/ModelPicker.svelte';
	import { Popover } from 'fuchs';

	let {
		items,
		open = $bindable(false),
		alwaysRotate = false,
		onselect,
		canvasClasses = '',
		triggerClasses = '',
		title
	}: {
		open?: boolean;
		items: { voxels: Voxel[]; label: string }[];
		alwaysRotate?: boolean;
		onselect?: ({ voxels, label }: { voxels: Voxel[]; label: string }) => void;
		canvasClasses?: string;
		triggerClasses?: string;
		title?: string;
	} = $props();

	let ref = $state(null);
</script>

<Popover
	bind:open
	{triggerClasses}
	side={'top'}
	sideOffset={10}
	triggerText={title}
	class="mx-2 max-h-[60dvh] w-full max-w-[calc(100vw-1rem)] overflow-y-scroll"
>
	<ModelPicker
		{items}
		{alwaysRotate}
		onselect={({ voxels, label }) => {
			onselect?.({ voxels, label });
			open = false;
		}}
		{canvasClasses}
	/>
</Popover>
