export async function trackEvent(event: string, data?: Record<string, string | number>) {
	// @ts-expect-error umami is not defined in the global scope
	if (window.umami) {
		// @ts-expect-error umami is not defined in the global scope
		window.umami?.track(event, data);
	}
}
