<script lang="ts">
	import { Button, ToggleGroup, ToggleGroupItem } from 'fuchs';
	import { applyTransform, deleteInstance, editingState } from '$lib/world-editor/state.svelte';
	import { onMount } from 'svelte';

	$effect(() => {
		if (editingState.selectedInstance) {
			applyTransform();
		}
		editingState.tool = selectedTool;
	});

	onMount(() => {
		window.addEventListener('keydown', async (e) => {
			if (
				e.target instanceof HTMLInputElement ||
				(e.target instanceof HTMLElement && e.target.contentEditable === 'true')
			)
				return;

			if (e.key === 'r') {
				selectedTool = 'rotate';
			} else if (e.key === 's') {
				selectedTool = 'scale';
			} else if (e.key === 'g') {
				selectedTool = 'move';
			} else if (e.key === 'd') {
				if (!editingState.selectedInstance) return;
				editingState.selectedModelId = editingState.selectedInstance.id;
				editingState.selectedInstance = null;
			} else if (e.key === 'p') {
				if (!editingState.selectedInstance) return;

				applyTransform();
				editingState.selectedModelId = editingState.selectedInstance.id;
				editingState.selectedInstance = null;
			} else if (e.key === 'x') {
				// delete
				if (!editingState.selectedInstance) return;
				deleteInstance(editingState.selectedInstance.id);
				editingState.selectedInstance = null;
			} else if (e.key === 'Escape') {
				applyTransform();

				editingState.selectedInstance = null;
				editingState.selectedModelId = null;
			}
		});
	});

	let selectedTool = $state(editingState.tool);
</script>

{#if editingState.selectedInstance}
	<div class="absolute top-2 right-2">
		<div class="bg-base-100 flex gap-4 rounded-2xl p-2">
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
			<Button
				size="iconLg"
				variant="ghost"
				onclick={() => {
					if (!editingState.selectedInstance) return;
					deleteInstance(editingState.selectedInstance.id);
					editingState.selectedInstance = null;
				}}
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

				<span class="sr-only">Delete instance</span>
			</Button>
			<Button
				size="iconLg"
				variant="ghost"
				onclick={() => {
					if (!editingState.selectedInstance) return;
					console.log(editingState.selectedInstance);
					editingState.selectedModelId = editingState.selectedInstance.id;
					console.log(editingState.selectedModelId);
					editingState.selectedInstance = null;
				}}
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
						d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
					/>
				</svg>

				<span class="sr-only">Clone instance</span>
			</Button>
		</div>
	</div>
{/if}
