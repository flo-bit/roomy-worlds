<script>
	import { Label, SliderNumber, ColorGradientPicker, Button } from "fuchs";
	import { editingState } from "./state.svelte";

</script>
<div class="absolute top-0 bottom-0 left-0 w-80 px-8 py-16">
	<Label>Size</Label>
	<SliderNumber
		class="mt-2"
		min={20}
		max={100}
		type="single"
		bind:value={editingState.worldSettings.size}
	/>

	<Label>Terrain</Label>
	<ColorGradientPicker
		class="mt-6 mb-8"
		bind:colors={editingState.worldSettings.terrainGradient}
		onchange={() => {
			editingState.worldSettings.version += 1;
		}}
	/>

	<Label>Water</Label>

	<ColorGradientPicker
		class="mt-6 mb-4"
		bind:colors={editingState.worldSettings.waterGradient}
		onchange={() => {
			editingState.worldSettings.version += 1;
		}}
	/>

	<Label>Percentage</Label>
	<SliderNumber
		class="mt-2"
		type="single"
		bind:value={editingState.worldSettings.waterPercentage}
	/>

	<Button
		class="mt-6"
		onclick={() => {
			editingState.worldSettings.version += 1;
		}}
	>
		Update
	</Button>
</div>