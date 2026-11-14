/// <reference types="@sveltejs/kit" />

declare global {
	namespace App {
		interface Locals {
			user?: {
				isAdmin: boolean;
				sessionId?: string;
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

export {};
