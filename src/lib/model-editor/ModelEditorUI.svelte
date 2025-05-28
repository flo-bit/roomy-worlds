<script lang="ts">
	import { Button, Toggle, ToggleGroup, ToggleGroupItem } from 'fuchs';
	import { addVoxel, applyModelEditorTransform, deleteVoxel, modelEditor } from './state.svelte';
	import { editingState } from '$lib/world-editor/state.svelte';
	import { onMount } from 'svelte';

	import { PopoverColorPicker } from '@fuxui/colors';

	$effect(() => {
		applyModelEditorTransform();
		modelEditor.tool = selectedTool;
	});

	onMount(() => {
		window.addEventListener('keydown', async (e) => {
			// if target is input, don't handle
			if (e.target instanceof HTMLInputElement) return;

			if (e.key === 'r') {
				selectedTool = 'rotate';
			} else if (e.key === 's') {
				selectedTool = 'scale';
			} else if (e.key === 'g') {
				selectedTool = 'move';
			} else if (e.key === 'd') {
				selectedTool = 'delete';
			} else if (e.key === 'p') {
				selectedTool = 'place';
			} else if (e.key === 'c') {
				if (modelEditor.selectedVoxel === null) return;

				applyModelEditorTransform();

				await new Promise((resolve) => setTimeout(resolve, 10));
				// clone
				let v = modelEditor.selectedVoxel;
				if (!v?.transform) return;

				addVoxel(
					[v.transform.x, v.transform.y, v.transform.z],
					[v.r, v.g, v.b],
					[v.transform.sx, v.transform.sy, v.transform.sz],
					[v.transform.rx, v.transform.ry, v.transform.rz, v.transform.rw]
				);
			} else if (e.key === 'x') {
				// delete
				if (modelEditor.selectedVoxel === null) return;
				deleteVoxel(modelEditor.selectedVoxel.id);
				modelEditor.selectedVoxel = null;
			}
		});
	});

	let selectedTool = $state(modelEditor.tool);
</script>

<div class="absolute top-2 right-2">
	<div class="bg-base-100 flex gap-4 rounded-2xl p-2 px-3">
		<!-- add cube -->
		<Toggle
			bind:pressed={
				() => {
					return selectedTool === 'place';
				},
				(value) => {
					selectedTool = 'place';
				}
			}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-6"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
			</svg>
		</Toggle>
		<!-- remove cube -->
		<Toggle
			bind:pressed={
				() => {
					return selectedTool === 'delete';
				},
				(value) => {
					selectedTool = 'delete';
				}
			}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
				/>
			</svg>
		</Toggle>
		<ToggleGroup
			type="single"
			bind:value={
				() => {
					return selectedTool;
				},
				(value) => {
					selectedTool = value;
				}
			}
		>
			<!-- move -->
			<ToggleGroupItem value="move">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
					/>
				</svg>
			</ToggleGroupItem>

			<!-- rotate -->
			<ToggleGroupItem value="rotate">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
					/>
				</svg>
			</ToggleGroupItem>
			<!-- scale -->
			<ToggleGroupItem value="scale">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
					/>
				</svg>
			</ToggleGroupItem>
		</ToggleGroup>

		<PopoverColorPicker
			bind:rgb={modelEditor.color}
			onchange={(e) => {
				if (!modelEditor.selectedVoxel) return;
				modelEditor.selectedVoxel.r = e.rgb.r;
				modelEditor.selectedVoxel.g = e.rgb.g;
				modelEditor.selectedVoxel.b = e.rgb.b;
			}}
		/>
	</div>
</div>

<div class="absolute right-2 bottom-2">
	<Button
		size="iconLg"
		onclick={() => {
			editingState.showModelEditor = false;
			if (modelEditor.voxelObject)
				editingState.selectedModelId = modelEditor.voxelObject.id;
		}}
	>
		Back to world
	</Button>
</div>

<!-- delete from public model list -->
<!-- {#if dev}
	<Button
		size="lg"
		class="absolute bottom-2 left-2"
		onclick={async () => {
			if (!g.voxelObject || !g.roomy) return;

			const id = 'leaf:6hv4pxwp66xa5g9jqqz2q4jr39ryahrceafe71e2vwys1fstjmw0';

			const models = await g.roomy.open(Models, id);
			const index = (await models.models.items()).findIndex((m) => m.id === g.voxelObject?.id);
			if (index === -1) return;
			models.models.remove(index);
			models.commit();
		}}
	>
		Delete
	</Button>
{/if} -->

<!-- add to public model list -->
<!-- {#if dev}
	<Button
		size="lg"
		class="absolute bottom-2 left-28"
		onclick={async () => {
			if (!g.voxelObject || !g.roomy) return;

			const id = 'leaf:6hv4pxwp66xa5g9jqqz2q4jr39ryahrceafe71e2vwys1fstjmw0';

			const models = await g.roomy.open(Models, id);
			models.models.push(g.voxelObject);
			models.commit();
		}}
	>
		Publish
	</Button>
{/if} -->
