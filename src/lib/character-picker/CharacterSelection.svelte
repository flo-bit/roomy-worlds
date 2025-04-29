<script lang="ts">
	import { base } from '$app/paths';
	import { editingState } from '$lib/world-editor/state.svelte';
	import ModalModelPicker from './modal/ModalModelPicker.svelte';

	const items = [
		{
			path: '/characters/character-male-a.glb',
			label: 'Male A'
		},
		{
			path: '/characters/character-female-a.glb',
			label: 'Female A'
		},
		{
			path: '/characters/character-male-b.glb',
			label: 'Male B'
		},
		{
			path: '/characters/character-female-b.glb',
			label: 'Female B'
		},
		{
			path: '/characters/character-male-c.glb',
			label: 'Male C'
		},
		{
			path: '/characters/character-female-c.glb',
			label: 'Female C'
		},
		{
			path: '/characters/character-male-d.glb',
			label: 'Male D'
		},
		{
			path: '/characters/character-female-d.glb',
			label: 'Female D'
		},
		{
			path: '/characters/character-male-e.glb',
			label: 'Male E'
		},
		{
			path: '/characters/character-female-e.glb',
			label: 'Female E'
		},
		{
			path: '/characters/character-male-f.glb',
			label: 'Male F'
		},
		{
			path: '/characters/character-female-f.glb',
			label: 'Female F'
		}
	].map((item) => ({
		path: base + item.path,
		label: item.label
	}));
</script>

<ModalModelPicker
	{items}
	onselect={({ path, label }) => {
		editingState.selectedCharacter = label.toLowerCase()
		editingState.camera = 'first';
	}}
	bind:open={editingState.showCharacterPicker}
/>