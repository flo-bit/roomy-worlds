<script>
	import { Button, cn } from 'fuchs';
	import { applyTransform, editingState } from './state.svelte';
	import InstanceEditorUi from './InstanceEditorUI.svelte';
</script>

<Button
	size="iconLg"
	class={cn(
		'bg-accent-100 hover:bg-accent-200 absolute top-4 duration-100',
		editingState.showWorldSettings ? 'left-84' : 'left-4'
	)}
	onclick={() => {
		editingState.showWorldSettings = false;
		editingState.showModelPicker = true;
	}}
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="2.5"
		stroke="currentColor"
	>
		<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
	</svg>

	<span class="sr-only">Add Model</span>
</Button>

{#if editingState.selectedInstance || editingState.selectedModelId}
	<Button
		size="iconSm"
		class={cn(
			'bg-accent-100 hover:bg-accent-200 absolute top-18 rounded-xl duration-100',
			editingState.showWorldSettings ? 'left-84' : 'left-4'
		)}
		onclick={() => {
			applyTransform();
			editingState.selectedInstance = null;
			editingState.selectedModelId = null;
		}}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="2.5"
			stroke="currentColor"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
		</svg>

		<span class="sr-only"> deselect </span>
	</Button>

	<span
		class={cn(
			'absolute top-17 text-sm font-medium transition-all duration-100',
			editingState.showWorldSettings ? 'left-93' : 'left-13'
		)}
		>{editingState.selectedInstance ? 'editing' : 'placing'}
	</span>
{/if}

<InstanceEditorUi />

<div
	class={cn(
		'absolute bottom-4 flex flex-col gap-2 transition-all duration-100',
		editingState.showWorldSettings ? 'left-84' : 'left-4'
	)}
>
	{#if editingState.camera === 'first'}
		<Button
			size="iconLg"
			class={cn('bg-accent-100 hover:bg-accent-200')}
			onclick={() => {
				editingState.camera = 'third';
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				class="size-6"
			>
				<path
					d="M15.75 8.25a.75.75 0 0 1 .75.75c0 1.12-.492 2.126-1.27 2.812a.75.75 0 1 1-.992-1.124A2.243 2.243 0 0 0 15 9a.75.75 0 0 1 .75-.75Z"
				/>
				<path
					fill-rule="evenodd"
					d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM4.575 15.6a8.25 8.25 0 0 0 9.348 4.425 1.966 1.966 0 0 0-1.84-1.275.983.983 0 0 1-.97-.822l-.073-.437c-.094-.565.25-1.11.8-1.267l.99-.282c.427-.123.783-.418.982-.816l.036-.073a1.453 1.453 0 0 1 2.328-.377L16.5 15h.628a2.25 2.25 0 0 1 1.983 1.186 8.25 8.25 0 0 0-6.345-12.4c.044.262.18.503.389.676l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.575 15.6Z"
					clip-rule="evenodd"
				/>
			</svg>

			<span class="sr-only">Back to World View</span>
		</Button>
	{:else}
		<Button
			size="iconLg"
			class={cn('bg-accent-100 hover:bg-accent-200')}
			onclick={() => {
				editingState.showWorldSettings = false;
				if (editingState.selectedCharacter) {
					editingState.camera = 'first';
				} else {
					editingState.showCharacterPicker = true;
				}
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				class="size-6"
			>
				<path
					fill-rule="evenodd"
					d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
					clip-rule="evenodd"
				/>
			</svg>
			<span class="sr-only">Walk around</span>
		</Button>
	{/if}

	<Button
		class={cn('bg-accent-100 hover:bg-accent-200')}
		size="iconLg"
		onclick={() => {
			editingState.showWorldSettings = !editingState.showWorldSettings;
		}}
	>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
			<path
				fill-rule="evenodd"
				d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 0 1-.517.608 7.45 7.45 0 0 0-.478.198.798.798 0 0 1-.796-.064l-.453-.324a1.875 1.875 0 0 0-2.416.2l-.243.243a1.875 1.875 0 0 0-.2 2.416l.324.453a.798.798 0 0 1 .064.796 7.448 7.448 0 0 0-.198.478.798.798 0 0 1-.608.517l-.55.092a1.875 1.875 0 0 0-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 0 1-.064.796l-.324.453a1.875 1.875 0 0 0 .2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 0 1 .796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 0 1 .517-.608 7.52 7.52 0 0 0 .478-.198.798.798 0 0 1 .796.064l.453.324a1.875 1.875 0 0 0 2.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 0 1-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 0 0 1.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 0 1-.608-.517 7.507 7.507 0 0 0-.198-.478.798.798 0 0 1 .064-.796l.324-.453a1.875 1.875 0 0 0-.2-2.416l-.243-.243a1.875 1.875 0 0 0-2.416-.2l-.453.324a.798.798 0 0 1-.796.064 7.462 7.462 0 0 0-.478-.198.798.798 0 0 1-.517-.608l-.091-.55a1.875 1.875 0 0 0-1.85-1.566h-.344ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
				clip-rule="evenodd"
			/>
		</svg>

		<span class="sr-only">World Settings</span>
	</Button>
</div>
