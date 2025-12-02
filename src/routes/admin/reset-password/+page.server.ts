import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import {
	resetPasswordWithRecoveryKey,
	logSecurityEvent,
	getClientIp,
	sanitizeUserAgent
} from '$lib/server/auth';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async () => {
	// Check if recovery key is configured
	const hasRecoveryKey = !!env.RECOVERY_KEY_HASH;

	return {
		hasRecoveryKey
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const ipAddress = getClientIp(request);
		const userAgent = sanitizeUserAgent(request.headers.get('user-agent'));
		const formData = await request.formData();

		const recoveryKey = formData.get('recoveryKey');
		const newPassword = formData.get('newPassword');
		const confirmPassword = formData.get('confirmPassword');

		if (!recoveryKey || typeof recoveryKey !== 'string') {
			return fail(400, { error: 'Recovery key is required' });
		}

		if (!newPassword || typeof newPassword !== 'string') {
			return fail(400, { error: 'New password is required' });
		}

		if (newPassword !== confirmPassword) {
			return fail(400, { error: 'Passwords do not match' });
		}

		const storedHash = env.RECOVERY_KEY_HASH;
		if (!storedHash) {
			await logSecurityEvent('login_failed', ipAddress, userAgent, {
				action: 'password_reset_attempt',
				reason: 'no_recovery_key_configured'
			});
			return fail(400, { error: 'Password reset is not configured. Contact the administrator.' });
		}

		const result = await resetPasswordWithRecoveryKey(recoveryKey, storedHash, newPassword);

		if (!result.success) {
			await logSecurityEvent('login_failed', ipAddress, userAgent, {
				action: 'password_reset_failed',
				reason: result.error
			});
			return fail(400, { error: result.error });
		}

		await logSecurityEvent('login_success', ipAddress, userAgent, {
			action: 'password_reset_success'
		});

		return {
			success: true,
			newHash: result.newHash,
			message: 'Password has been reset successfully.'
		};
	}
};
