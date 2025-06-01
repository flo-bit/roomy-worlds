<script lang="ts" module>
	export const jumpButtonData = $state({
		pressed: false
	});
</script>

<button
	class="absolute right-20 bottom-4 inline-flex size-20 items-center justify-center rounded-full bg-white/30 pointer-fine:hidden"
	onpointerdown={() => {
		jumpButtonData.pressed = true;
	}}
>
	<svg xmlns="http://www.w3.org/2000/svg" class="size-12 text-base-100" viewBox="0 0 24 24"
		><g
			fill="none"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="1.5"
			><path d="m4.5 18.75l7.5-7.5l7.5 7.5" /><path d="m4.5 12.75l7.5-7.5l7.5 7.5" /></g
		></svg
	>
	<span class="sr-only">Jump</span>
</button>
