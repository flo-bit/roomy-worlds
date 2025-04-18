<script lang="ts">
	import { Button, Modal } from 'fuchs';
	import ModelPicker from '../base/ModelPicker.svelte';
	import type { VoxelGroup } from '$lib/shared/components';

	let {
		items,
		open = $bindable(),
		alwaysRotate = false,
		onselect,
		canvasClasses = '',
		title,
		newModelButtonClick
	}: {
		open: boolean;
		items: { voxels: VoxelGroup; label: string }[];
		alwaysRotate?: boolean;
		onselect?: ({ voxels, label }: { voxels: VoxelGroup; label: string }) => void;
		canvasClasses?: string;
		title?: string;
		newModelButtonClick?: () => void;
	} = $props();
</script>

<Modal bind:open class="mx-auto max-h-[80dvh] max-w-5xl overflow-hidden overflow-y-scroll" {title}>
	<Button size="lg" class="w-fit" onclick={newModelButtonClick}>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
		  </svg>
		  
		  New Model</Button>


	<ModelPicker
		{items}
		{alwaysRotate}
		onselect={({ voxels, label }) => {
			onselect?.({ voxels, label });
			open = false;
		}}
		{canvasClasses}
	/>
</Modal>
