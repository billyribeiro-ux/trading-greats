import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import {
	changePassword,
	generateRecoveryKey,
	getActiveSessions,
	getSecurityEvents,
	getBlockedIps,
	revokeSessionById,
	revokeAllSessions,
	unblockIp,
	logSecurityEvent,
	getClientIp,
	sanitizeUserAgent
} from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals }) => {
	// Get active sessions
	const sessions = await getActiveSessions();

	// Get recent security events
	const securityEvents = await getSecurityEvents(50);

	// Get blocked IPs
	const blockedIps = await getBlockedIps();

	return {
		sessions,
		securityEvents,
		blockedIps,
		currentSessionId: locals.user?.sessionId
	};
};

export const actions: Actions = {
	changePassword: async ({ request, cookies }) => {
		const ipAddress = getClientIp(request);
		const userAgent = sanitizeUserAgent(request.headers.get('user-agent'));
		const formData = await request.formData();

		const currentPassword = formData.get('currentPassword');
		const newPassword = formData.get('newPassword');
		const confirmPassword = formData.get('confirmPassword');

		if (!currentPassword || typeof currentPassword !== 'string') {
			return fail(400, { passwordError: 'Current password is required' });
		}

		if (!newPassword || typeof newPassword !== 'string') {
			return fail(400, { passwordError: 'New password is required' });
		}

		if (newPassword !== confirmPassword) {
			return fail(400, { passwordError: 'New passwords do not match' });
		}

		const result = await changePassword(currentPassword, newPassword);

		if (!result.success) {
			await logSecurityEvent('login_failed', ipAddress, userAgent, {
				action: 'password_change_failed',
				reason: result.error
			});
			return fail(400, { passwordError: result.error });
		}

		await logSecurityEvent('login_success', ipAddress, userAgent, {
			action: 'password_changed'
		});

		// Clear the session cookie since all sessions were revoked
		cookies.delete('admin_session', { path: '/' });

		return {
			passwordSuccess: true,
			newHash: result.newHash,
			message: 'Password changed successfully. Please update your .env file with the new ADMIN_PASSWORD_HASH and log in again.'
		};
	},

	generateRecoveryKey: async ({ request }) => {
		const ipAddress = getClientIp(request);
		const userAgent = sanitizeUserAgent(request.headers.get('user-agent'));

		const { key, hash } = await generateRecoveryKey();

		await logSecurityEvent('login_success', ipAddress, userAgent, {
			action: 'recovery_key_generated'
		});

		return {
			recoveryKey: key,
			recoveryHash: hash,
			message: 'Save this recovery key securely. You will need it to reset your password if forgotten.'
		};
	},

	revokeSession: async ({ request }) => {
		const ipAddress = getClientIp(request);
		const userAgent = sanitizeUserAgent(request.headers.get('user-agent'));
		const formData = await request.formData();
		const sessionId = formData.get('sessionId');

		if (!sessionId || typeof sessionId !== 'string') {
			return fail(400, { sessionError: 'Session ID is required' });
		}

		const success = await revokeSessionById(sessionId);

		if (success) {
			await logSecurityEvent('session_revoked', ipAddress, userAgent, {
				revokedSessionId: sessionId
			});
		}

		return { sessionRevoked: success };
	},

	revokeAllSessions: async ({ request, cookies }) => {
		const ipAddress = getClientIp(request);
		const userAgent = sanitizeUserAgent(request.headers.get('user-agent'));

		const success = await revokeAllSessions();

		if (success) {
			await logSecurityEvent('session_revoked', ipAddress, userAgent, {
				action: 'all_sessions_revoked'
			});

			// Clear current session
			cookies.delete('admin_session', { path: '/' });
		}

		return {
			allSessionsRevoked: success,
			message: 'All sessions have been revoked. You will need to log in again.'
		};
	},

	unblockIp: async ({ request }) => {
		const currentIp = getClientIp(request);
		const userAgent = sanitizeUserAgent(request.headers.get('user-agent'));
		const formData = await request.formData();
		const ipAddress = formData.get('ipAddress');

		if (!ipAddress || typeof ipAddress !== 'string') {
			return fail(400, { ipError: 'IP address is required' });
		}

		const success = await unblockIp(ipAddress);

		if (success) {
			await logSecurityEvent('ip_unblocked', currentIp, userAgent, {
				unblockedIp: ipAddress
			});
		}

		return { ipUnblocked: success };
	}
};
