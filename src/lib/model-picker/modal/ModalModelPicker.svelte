<script lang="ts">
	import { Button, cn, Modal, Select } from 'fuchs';
	import ModelPicker from '../base/ModelPicker.svelte';
	import { editingState } from '$lib/world-editor/state.svelte';
	import type { VoxelGroup } from '$lib/roomy';

	let {
		items,
		open = $bindable(),
		alwaysRotate = false,
		onselect,
		title,
		newModelButtonClick,
		showEditButton = false
	}: {
		open: boolean;
		items: { voxels: VoxelGroup; label: string }[];
		alwaysRotate?: boolean;
		onselect?: ({ voxels, label }: { voxels: VoxelGroup; label: string }) => void;
		title?: string;
		newModelButtonClick?: () => void;
		showEditButton?: boolean;
	} = $props();
</script>

<Modal
	bind:open
	class="mx-auto flex h-full max-h-[80dvh] max-w-5xl flex-col overflow-hidden overflow-y-scroll"
	{title}
>
	<div class="flex flex-wrap items-center justify-between gap-2">
		<Button size="lg" class="h-fit w-fit" onclick={newModelButtonClick}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="2.5"
				stroke="currentColor"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
			</svg>

			New Model
		</Button>

		<Select
			items={[
				{ label: 'private', value: 'private' },
				{ label: 'world', value: 'world' },
				{ label: 'public', value: 'public' }
			]}
			bind:selected={editingState.modelPickerType}
		></Select>
	</div>

	{#if items.length === 0}
		<p class="pt-8 text-xl font-semibold">No models, create one!</p>
	{/if}

	<ModelPicker
		{items}
		{alwaysRotate}
		onselect={({ voxels, label }) => {
			onselect?.({ voxels, label });
			open = false;
		}}
		{showEditButton}
		canvasClasses={'max-h-[80dvh] mx-auto max-w-5xl my-[10dvh] pointer-events-none'}
	/>
</Modal>
