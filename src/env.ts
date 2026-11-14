import { defineEnvVars } from '@sveltejs/kit/env';

// Optional variables use an empty string when absent; callers apply their existing defaults or disable the relevant integration.
export const variables = defineEnvVars({
	PUBLIC_SITE_NAME: { public: true, schema: (input) => input ?? '' },
	PUBLIC_SITE_URL: { public: true, schema: (input) => input ?? '' },
	CLOUDINARY_CLOUD_NAME: { schema: (input) => input ?? '' },
	CLOUDINARY_API_KEY: { schema: (input) => input ?? '' },
	CLOUDINARY_API_SECRET: { schema: (input) => input ?? '' },
	RECOVERY_KEY_HASH: { schema: (input) => input ?? '' },
	ADMIN_PASSWORD_HASH: { schema: (input) => input ?? '' },
	ADMIN_PASSWORD: { schema: (input) => input ?? '' },
	TURSO_DATABASE_URL: { schema: (input) => input ?? '' },
	TURSO_AUTH_TOKEN: { schema: (input) => input ?? '' },
	RESEND_API_KEY: { schema: (input) => input ?? '' },
	NEWSLETTER_FROM_EMAIL: { schema: (input) => input ?? '' },
	NEWSLETTER_FROM_NAME: { schema: (input) => input ?? '' },
	R2_ACCOUNT_ID: { schema: (input) => input ?? '' },
	R2_ACCESS_KEY_ID: { schema: (input) => input ?? '' },
	R2_SECRET_ACCESS_KEY: { schema: (input) => input ?? '' },
	R2_BUCKET_NAME: { schema: (input) => input ?? '' },
	STORAGE_PROVIDER: { schema: (input) => input ?? '' },
	R2_PUBLIC_URL: { schema: (input) => input ?? '' }
});
