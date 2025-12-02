/// <reference types="@sveltejs/kit" />

declare global {
	namespace App {
		interface Locals {
			user?: {
				isAdmin: boolean;
			};
		}
		interface Error {
			message: string;
			code?: string;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module '$env/static/public' {
	export const PUBLIC_SITE_URL: string;
	export const PUBLIC_SITE_NAME: string;
}

declare module '$env/static/private' {
	export const TURSO_DATABASE_URL: string;
	export const TURSO_AUTH_TOKEN: string;
	export const ADMIN_PASSWORD: string;
	export const ADMIN_SECRET: string;
}

export {};
