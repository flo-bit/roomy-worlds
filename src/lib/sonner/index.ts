export { default as Toaster } from './Toaster.svelte';
export { toast } from 'svelte-sonner';

export type Position =
	| 'top-left'
	| 'top-right'
	| 'bottom-left'
	| 'bottom-right'
	| 'top-center'
	| 'bottom-center';
