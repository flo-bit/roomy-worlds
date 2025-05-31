<script lang="ts">
	import { base } from '$app/paths';
	import { editingState } from '$lib/world-editor/state.svelte';
	import ModalModelPicker from './modal/ModalModelPicker.svelte';

	const items = [
		{
			path: '/new-characters/Protagonist_A.glb',
			label: 'Protagonist A'
		},
		{
			path: '/new-characters/Protagonist_B.glb',
			label: 'Protagonist B'
		},
		{
			path: '/new-characters/Hiker.glb',
			label: 'Hiker'
		},
		{
			path: '/new-characters/Caveman.glb',
			label: 'Caveman'
		},
		{
			path: '/new-characters/Witch.glb',
			label: 'Witch'
		},
		{
			path: '/new-characters/CombatMech.glb',
			label: 'Combat Mech'
		},
		{
			path: '/new-characters/Superhero.glb',
			label: 'Superhero'
		},
		{
			path: '/new-characters/Vampire.glb',
			label: 'Vampire'
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