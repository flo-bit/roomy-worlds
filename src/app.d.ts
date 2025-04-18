import type { InteractivityProps } from '@threlte/extras';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	namespace Threlte {
		// eslint-disable-next-line @typescript-eslint/no-empty-object-type
		interface UserProps extends InteractivityProps {}
	}
}

export {};
