import { getProfile } from '$lib/oauth/auth.svelte';
import type { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs';

class Users {
	users: Record<string, ProfileViewDetailed> = $state({});

	async getUser(did: string | undefined | null) {
		if (!did) return null;

		if (this.users[did]) return this.users[did];

		const profile = await getProfile({ did });

		this.users[did] = profile;

		return profile;
	}
}

export const users = new Users();
