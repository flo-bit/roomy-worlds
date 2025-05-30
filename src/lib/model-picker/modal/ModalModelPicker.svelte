<script lang="ts">
	import { Button, cn, Modal, Select } from 'fuchs';
	import ModelPicker from '../base/ModelPicker.svelte';
	import { editingState } from '$lib/world-editor/state.svelte';
	import { ColorSelect } from '@fuxui/colors';

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
		items: { path: string; label: string }[];
		alwaysRotate?: boolean;
		onselect?: ({ path, label }: { path: string; label: string }) => void;
		title?: string;
		newModelButtonClick?: () => void;
		showEditButton?: boolean;
	} = $props();

	let colors = ['#3C741E', '#006A30', '#658E2B', '#00594E', '#AA7C23', '#AC660D', '#AA2E37', '#B46E6C'];

	let modelPickerColor = $state(colors[editingState.modelPickerColor ?? 0]);
</script>

<Modal
	bind:open
	class="mx-auto flex h-full max-h-[80dvh] max-w-5xl flex-col overflow-hidden overflow-y-scroll"
	{title}
>
	<div class="flex flex-wrap items-center justify-between gap-2">
		<!-- <Select
			items={[
				{ label: 'private', value: 'private' },
				{ label: 'world', value: 'world' },
				{ label: 'public', value: 'public' }
			]}
			bind:selected={editingState.modelPickerType}
		></Select> -->

		<ColorSelect
			colors={colors}
			bind:selected={modelPickerColor}
			onselected={(color) => {
				editingState.modelPickerColor = colors.indexOf(color);
			}}
		/>
	</div>

	{#if items.length === 0}
		<p class="pt-8 text-xl font-semibold">Loading models...</p>
	{/if}

	<ModelPicker
		{items}
		{alwaysRotate}
		onselect={(props) => {
			onselect?.(props);
			open = false;
		}}
		{showEditButton}
		canvasClasses={'max-h-[80dvh] mx-auto max-w-5xl my-[10dvh] pointer-events-none'}
	/>
</Modal>
