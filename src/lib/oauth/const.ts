import { base } from '$app/paths';

export const SITE_URL = 'https://flo-bit.dev';

export const metadata = {
	client_id: `${SITE_URL}${base}/client-metadata.json`,

	redirect_uris: [SITE_URL + base],

	scope: 'atproto transition:generic',
	grant_types: ['authorization_code', 'refresh_token'],
	response_types: ['code'],
	token_endpoint_auth_method: 'none',
	application_type: 'web',
	dpop_bound_access_tokens: true
};
