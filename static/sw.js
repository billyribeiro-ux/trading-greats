// Minimal service worker to prevent 404 errors
// This is a placeholder - enhance for PWA functionality if needed

self.addEventListener('install', (event) => {
	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
	// Pass through all requests to the network
	event.respondWith(fetch(event.request));
});
