/**
 * Secure Authentication System
 *
 * Features:
 * - Password hashing with PBKDF2 (100,000 iterations)
 * - Cryptographically secure session tokens
 * - Rate limiting and brute force protection
 * - IP blocking after excessive failed attempts
 * - Session management with expiry
 * - Security audit logging
 */

import { db } from './db';
import {
	adminSessions,
	loginAttempts,
	ipBlocklist,
	securityAuditLog
} from './schema';
import { eq, and, gte, lt, desc } from 'drizzle-orm';
import { env } from '$env/dynamic/private';

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
	// Password hashing
	PBKDF2_ITERATIONS: 100000,
	HASH_KEY_LENGTH: 64,
	SALT_LENGTH: 32,

	// Session settings
	SESSION_TOKEN_LENGTH: 64,
	SESSION_EXPIRY_HOURS: 24, // Sessions expire after 24 hours
	SESSION_IDLE_TIMEOUT_MINUTES: 60, // Revoke after 60 mins of inactivity

	// Rate limiting
	MAX_FAILED_ATTEMPTS_PER_HOUR: 5,
	MAX_FAILED_ATTEMPTS_BEFORE_BLOCK: 10,
	BLOCK_DURATION_MINUTES: 30,

	// Lockout escalation
	LOCKOUT_ESCALATION: [
		{ attempts: 10, duration: 30 },    // 30 minutes after 10 attempts
		{ attempts: 20, duration: 120 },   // 2 hours after 20 attempts
		{ attempts: 30, duration: 1440 },  // 24 hours after 30 attempts
		{ attempts: 50, duration: 10080 }, // 7 days after 50 attempts
	]
};

// ============================================================================
// CRYPTOGRAPHIC UTILITIES
// ============================================================================

/**
 * Generate cryptographically secure random bytes as hex string
 */
function generateSecureRandom(length: number): string {
	const array = new Uint8Array(length);
	crypto.getRandomValues(array);
	return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Hash data using SHA-256
 */
async function sha256(data: string): Promise<string> {
	const encoder = new TextEncoder();
	const dataBuffer = encoder.encode(data);
	const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Hash password using PBKDF2
 */
async function hashPassword(password: string, salt: string): Promise<string> {
	const encoder = new TextEncoder();
	const passwordBuffer = encoder.encode(password);
	const saltBuffer = encoder.encode(salt);

	const keyMaterial = await crypto.subtle.importKey(
		'raw',
		passwordBuffer,
		'PBKDF2',
		false,
		['deriveBits']
	);

	const derivedBits = await crypto.subtle.deriveBits(
		{
			name: 'PBKDF2',
			salt: saltBuffer,
			iterations: CONFIG.PBKDF2_ITERATIONS,
			hash: 'SHA-256'
		},
		keyMaterial,
		CONFIG.HASH_KEY_LENGTH * 8
	);

	return Array.from(new Uint8Array(derivedBits), b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify password against stored hash
 */
async function verifyPassword(password: string, storedHash: string, salt: string): Promise<boolean> {
	const hash = await hashPassword(password, salt);
	// Constant-time comparison to prevent timing attacks
	if (hash.length !== storedHash.length) return false;
	let result = 0;
	for (let i = 0; i < hash.length; i++) {
		result |= hash.charCodeAt(i) ^ storedHash.charCodeAt(i);
	}
	return result === 0;
}

// ============================================================================
// PASSWORD MANAGEMENT
// ============================================================================

// The admin password is stored as: salt:hash in the environment
// For first-time setup, use generatePasswordHash() to create the value

/**
 * Generate a password hash for storage in .env
 * Call this function once to generate the hash, then store it
 */
export async function generatePasswordHash(password: string): Promise<string> {
	const salt = generateSecureRandom(CONFIG.SALT_LENGTH);
	const hash = await hashPassword(password, salt);
	return `${salt}:${hash}`;
}

/**
 * Verify password against the stored hash in environment
 */
export async function verifyAdminPassword(password: string): Promise<boolean> {
	const storedCredential = env.ADMIN_PASSWORD_HASH;

	// Fallback for backwards compatibility with plain text passwords
	if (!storedCredential?.includes(':')) {
		// Plain text comparison (legacy mode - insecure)
		const plainPassword = env.ADMIN_PASSWORD;
		if (!plainPassword) return false;

		// Constant-time comparison even for plain text
		if (password.length !== plainPassword.length) return false;
		let result = 0;
		for (let i = 0; i < password.length; i++) {
			result |= password.charCodeAt(i) ^ plainPassword.charCodeAt(i);
		}
		return result === 0;
	}

	const [salt, hash] = storedCredential.split(':');
	if (!salt || !hash) return false;

	return verifyPassword(password, hash, salt);
}

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

export interface SessionInfo {
	id: string;
	token: string;
	expiresAt: Date;
	ipAddress: string | null;
	userAgent: string | null;
}

/**
 * Create a new admin session
 */
export async function createSession(
	ipAddress: string | null,
	userAgent: string | null
): Promise<SessionInfo> {
	const token = generateSecureRandom(CONFIG.SESSION_TOKEN_LENGTH);
	const tokenHash = await sha256(token);
	const now = new Date();
	const expiresAt = new Date(now.getTime() + CONFIG.SESSION_EXPIRY_HOURS * 60 * 60 * 1000);

	const [session] = await db.insert(adminSessions).values({
		token: token.substring(0, 16) + '...', // Only store partial token for reference
		tokenHash,
		expiresAt: expiresAt.toISOString(),
		lastActivityAt: now.toISOString(),
		ipAddress,
		userAgent: userAgent?.substring(0, 500) // Limit user agent length
	}).returning();

	return {
		id: session.id,
		token, // Return full token to be set in cookie
		expiresAt,
		ipAddress,
		userAgent
	};
}

/**
 * Validate a session token
 */
export async function validateSession(
	token: string,
	ipAddress: string | null
): Promise<{ valid: boolean; sessionId?: string; reason?: string }> {
	if (!token || token.length < CONFIG.SESSION_TOKEN_LENGTH * 2) {
		return { valid: false, reason: 'invalid_token_format' };
	}

	const tokenHash = await sha256(token);

	try {
		const sessions = await db
			.select()
			.from(adminSessions)
			.where(eq(adminSessions.tokenHash, tokenHash));

		const session = sessions[0];

		if (!session) {
			return { valid: false, reason: 'session_not_found' };
		}

		if (session.isRevoked) {
			return { valid: false, reason: 'session_revoked' };
		}

		const now = new Date();
		const expiresAt = new Date(session.expiresAt);

		if (now > expiresAt) {
			// Mark as revoked for cleanup
			await db.update(adminSessions)
				.set({ isRevoked: true })
				.where(eq(adminSessions.id, session.id));
			return { valid: false, reason: 'session_expired' };
		}

		// Check idle timeout
		const lastActivity = new Date(session.lastActivityAt ?? session.createdAt ?? now.toISOString());
		const idleTime = (now.getTime() - lastActivity.getTime()) / 1000 / 60;

		if (idleTime > CONFIG.SESSION_IDLE_TIMEOUT_MINUTES) {
			await db.update(adminSessions)
				.set({ isRevoked: true })
				.where(eq(adminSessions.id, session.id));
			return { valid: false, reason: 'session_idle_timeout' };
		}

		// Update last activity
		await db.update(adminSessions)
			.set({ lastActivityAt: now.toISOString() })
			.where(eq(adminSessions.id, session.id));

		return { valid: true, sessionId: session.id };
	} catch (error) {
		console.error('Session validation error:', error);
		return { valid: false, reason: 'validation_error' };
	}
}

/**
 * Revoke a session
 */
export async function revokeSession(token: string): Promise<boolean> {
	try {
		const tokenHash = await sha256(token);
		await db.update(adminSessions)
			.set({ isRevoked: true })
			.where(eq(adminSessions.tokenHash, tokenHash));
		return true;
	} catch (error) {
		console.error('Session revocation error:', error);
		return false;
	}
}

/**
 * Revoke all sessions (logout everywhere)
 */
export async function revokeAllSessions(): Promise<boolean> {
	try {
		await db.update(adminSessions)
			.set({ isRevoked: true })
			.where(eq(adminSessions.isRevoked, false));
		return true;
	} catch (error) {
		console.error('Revoke all sessions error:', error);
		return false;
	}
}

// ============================================================================
// RATE LIMITING & BRUTE FORCE PROTECTION
// ============================================================================

/**
 * Check if an IP is blocked
 */
export async function isIpBlocked(ipAddress: string): Promise<{ blocked: boolean; reason?: string; expiresAt?: Date }> {
	try {
		const blocks = await db
			.select()
			.from(ipBlocklist)
			.where(eq(ipBlocklist.ipAddress, ipAddress));

		const block = blocks[0];

		if (!block) {
			return { blocked: false };
		}

		// Check if block has expired
		if (block.expiresAt) {
			const expiresAt = new Date(block.expiresAt);
			if (new Date() > expiresAt) {
				// Remove expired block
				await db.delete(ipBlocklist).where(eq(ipBlocklist.id, block.id));
				return { blocked: false };
			}
			return { blocked: true, reason: block.reason, expiresAt };
		}

		// Permanent block
		return { blocked: true, reason: block.reason };
	} catch (error) {
		console.error('IP block check error:', error);
		return { blocked: false };
	}
}

/**
 * Get failed login attempts in the last hour
 */
export async function getRecentFailedAttempts(ipAddress: string): Promise<number> {
	try {
		const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

		const attempts = await db
			.select()
			.from(loginAttempts)
			.where(
				and(
					eq(loginAttempts.ipAddress, ipAddress),
					eq(loginAttempts.successful, false),
					gte(loginAttempts.attemptedAt, oneHourAgo)
				)
			);

		return attempts.length;
	} catch (error) {
		console.error('Failed attempts check error:', error);
		return 0;
	}
}

/**
 * Record a login attempt
 */
export async function recordLoginAttempt(
	ipAddress: string,
	userAgent: string | null,
	successful: boolean
): Promise<void> {
	try {
		await db.insert(loginAttempts).values({
			ipAddress,
			userAgent: userAgent?.substring(0, 500),
			successful
		});

		// Check if we need to block this IP
		if (!successful) {
			await checkAndBlockIp(ipAddress);
		}
	} catch (error) {
		console.error('Record login attempt error:', error);
	}
}

/**
 * Check if IP should be blocked and block if necessary
 */
async function checkAndBlockIp(ipAddress: string): Promise<void> {
	try {
		const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

		const recentAttempts = await db
			.select()
			.from(loginAttempts)
			.where(
				and(
					eq(loginAttempts.ipAddress, ipAddress),
					eq(loginAttempts.successful, false),
					gte(loginAttempts.attemptedAt, oneDayAgo)
				)
			);

		const failedCount = recentAttempts.length;

		// Find appropriate lockout duration
		let blockDuration = 0;
		for (const level of CONFIG.LOCKOUT_ESCALATION) {
			if (failedCount >= level.attempts) {
				blockDuration = level.duration;
			}
		}

		if (blockDuration > 0) {
			const expiresAt = new Date(Date.now() + blockDuration * 60 * 1000);

			// Upsert block
			const existingBlock = await db
				.select()
				.from(ipBlocklist)
				.where(eq(ipBlocklist.ipAddress, ipAddress));

			if (existingBlock[0]) {
				await db.update(ipBlocklist)
					.set({
						expiresAt: expiresAt.toISOString(),
						failedAttempts: failedCount,
						reason: `Excessive failed login attempts (${failedCount})`
					})
					.where(eq(ipBlocklist.ipAddress, ipAddress));
			} else {
				await db.insert(ipBlocklist).values({
					ipAddress,
					reason: `Excessive failed login attempts (${failedCount})`,
					expiresAt: expiresAt.toISOString(),
					failedAttempts: failedCount
				});
			}

			// Log security event
			await logSecurityEvent('ip_blocked', ipAddress, null, {
				failedAttempts: failedCount,
				blockDuration
			});
		}
	} catch (error) {
		console.error('Block IP check error:', error);
	}
}

/**
 * Check rate limit before allowing login attempt
 */
export async function checkRateLimit(ipAddress: string): Promise<{ allowed: boolean; retryAfter?: number; reason?: string }> {
	// First check if IP is blocked
	const blockStatus = await isIpBlocked(ipAddress);
	if (blockStatus.blocked) {
		const retryAfter = blockStatus.expiresAt
			? Math.ceil((blockStatus.expiresAt.getTime() - Date.now()) / 1000)
			: undefined;
		return {
			allowed: false,
			retryAfter,
			reason: blockStatus.reason || 'IP blocked due to suspicious activity'
		};
	}

	// Check recent failed attempts
	const recentFailed = await getRecentFailedAttempts(ipAddress);
	if (recentFailed >= CONFIG.MAX_FAILED_ATTEMPTS_PER_HOUR) {
		return {
			allowed: false,
			retryAfter: 3600, // 1 hour
			reason: `Too many failed attempts. Try again later.`
		};
	}

	return { allowed: true };
}

// ============================================================================
// SECURITY AUDIT LOGGING
// ============================================================================

export type SecurityAction =
	| 'login_success'
	| 'login_failed'
	| 'logout'
	| 'session_created'
	| 'session_revoked'
	| 'session_expired'
	| 'ip_blocked'
	| 'ip_unblocked'
	| 'rate_limit_exceeded'
	| 'suspicious_activity';

/**
 * Log a security event
 */
export async function logSecurityEvent(
	action: SecurityAction,
	ipAddress: string | null,
	userAgent: string | null,
	details?: Record<string, unknown>
): Promise<void> {
	try {
		await db.insert(securityAuditLog).values({
			action,
			ipAddress,
			userAgent: userAgent?.substring(0, 500),
			details: details || null
		});
	} catch (error) {
		console.error('Security log error:', error);
	}
}

/**
 * Get recent security events
 */
export async function getSecurityEvents(limit: number = 100): Promise<typeof securityAuditLog.$inferSelect[]> {
	try {
		return await db
			.select()
			.from(securityAuditLog)
			.orderBy(desc(securityAuditLog.timestamp))
			.limit(limit);
	} catch (error) {
		console.error('Get security events error:', error);
		return [];
	}
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Clean up expired sessions and old login attempts
 */
export async function cleanupExpiredData(): Promise<void> {
	try {
		const now = new Date().toISOString();

		// Revoke expired sessions
		await db.update(adminSessions)
			.set({ isRevoked: true })
			.where(
				and(
					eq(adminSessions.isRevoked, false),
					lt(adminSessions.expiresAt, now)
				)
			);

		// Delete very old sessions (older than 30 days)
		const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
		await db.delete(adminSessions)
			.where(lt(adminSessions.createdAt, thirtyDaysAgo));

		// Delete old login attempts (older than 7 days)
		const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
		await db.delete(loginAttempts)
			.where(lt(loginAttempts.attemptedAt, sevenDaysAgo));

		// Remove expired IP blocks
		await db.delete(ipBlocklist)
			.where(
				and(
					lt(ipBlocklist.expiresAt, now)
				)
			);

		// Delete old audit logs (older than 90 days)
		const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
		await db.delete(securityAuditLog)
			.where(lt(securityAuditLog.timestamp, ninetyDaysAgo));

	} catch (error) {
		console.error('Cleanup error:', error);
	}
}

/**
 * Get client IP from request
 */
export function getClientIp(request: Request): string {
	// Check common headers (in order of reliability)
	const headers = [
		'cf-connecting-ip',      // Cloudflare
		'x-real-ip',             // Nginx
		'x-forwarded-for',       // Standard proxy header
		'x-client-ip',           // Apache
		'true-client-ip',        // Akamai
	];

	for (const header of headers) {
		const value = request.headers.get(header);
		if (value) {
			// x-forwarded-for can contain multiple IPs, take the first one
			const ip = value.split(',')[0].trim();
			if (ip && isValidIp(ip)) {
				return ip;
			}
		}
	}

	return '127.0.0.1'; // Fallback
}

/**
 * Validate IP address format
 */
function isValidIp(ip: string): boolean {
	// IPv4
	const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
	if (ipv4Regex.test(ip)) {
		const parts = ip.split('.').map(Number);
		return parts.every(part => part >= 0 && part <= 255);
	}

	// IPv6 (simplified check)
	const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
	return ipv6Regex.test(ip);
}

/**
 * Sanitize user agent string
 */
export function sanitizeUserAgent(userAgent: string | null): string | null {
	if (!userAgent) return null;
	// Remove any potential injection characters
	return userAgent.replace(/[<>'"]/g, '').substring(0, 500);
}

// ============================================================================
// PASSWORD MANAGEMENT (Admin Portal)
// ============================================================================

/**
 * Change admin password - requires current password verification
 * Returns the new password hash to store in .env
 */
export async function changePassword(
	currentPassword: string,
	newPassword: string
): Promise<{ success: boolean; newHash?: string; error?: string }> {
	// Verify current password
	const isValid = await verifyAdminPassword(currentPassword);
	if (!isValid) {
		return { success: false, error: 'Current password is incorrect' };
	}

	// Validate new password strength
	const validation = validatePasswordStrength(newPassword);
	if (!validation.valid) {
		return { success: false, error: validation.error };
	}

	// Generate new hash
	const newHash = await generatePasswordHash(newPassword);

	// Revoke all existing sessions for security
	await revokeAllSessions();

	return { success: true, newHash };
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): { valid: boolean; error?: string } {
	if (password.length < 12) {
		return { valid: false, error: 'Password must be at least 12 characters long' };
	}
	if (!/[a-z]/.test(password)) {
		return { valid: false, error: 'Password must contain at least one lowercase letter' };
	}
	if (!/[A-Z]/.test(password)) {
		return { valid: false, error: 'Password must contain at least one uppercase letter' };
	}
	if (!/[0-9]/.test(password)) {
		return { valid: false, error: 'Password must contain at least one number' };
	}
	if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
		return { valid: false, error: 'Password must contain at least one special character' };
	}
	return { valid: true };
}

// ============================================================================
// RECOVERY KEY SYSTEM
// ============================================================================

/**
 * Generate a secure recovery key
 * This should be stored securely by the admin and used only for password reset
 */
export async function generateRecoveryKey(): Promise<{ key: string; hash: string }> {
	// Generate a long, secure recovery key
	const key = generateSecureRandom(32); // 64 character hex string
	// Format it as groups for readability: XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX
	const formattedKey = key.match(/.{8}/g)?.join('-') || key;

	// Hash it for storage
	const hash = await sha256(key);

	return { key: formattedKey, hash };
}

/**
 * Verify recovery key against stored hash
 */
export async function verifyRecoveryKey(key: string, storedHash: string): Promise<boolean> {
	// Remove formatting
	const cleanKey = key.replace(/-/g, '');
	const keyHash = await sha256(cleanKey);

	// Constant-time comparison
	if (keyHash.length !== storedHash.length) return false;
	let result = 0;
	for (let i = 0; i < keyHash.length; i++) {
		result |= keyHash.charCodeAt(i) ^ storedHash.charCodeAt(i);
	}
	return result === 0;
}

/**
 * Reset password using recovery key
 */
export async function resetPasswordWithRecoveryKey(
	recoveryKey: string,
	storedRecoveryHash: string,
	newPassword: string
): Promise<{ success: boolean; newHash?: string; error?: string }> {
	// Verify recovery key
	const isValid = await verifyRecoveryKey(recoveryKey, storedRecoveryHash);
	if (!isValid) {
		return { success: false, error: 'Invalid recovery key' };
	}

	// Validate new password strength
	const validation = validatePasswordStrength(newPassword);
	if (!validation.valid) {
		return { success: false, error: validation.error };
	}

	// Generate new hash
	const newHash = await generatePasswordHash(newPassword);

	// Revoke all existing sessions for security
	await revokeAllSessions();

	return { success: true, newHash };
}

// ============================================================================
// SESSION MANAGEMENT (Admin Portal)
// ============================================================================

/**
 * Get all active sessions
 */
export async function getActiveSessions(): Promise<{
	id: string;
	createdAt: string;
	lastActivityAt: string | null;
	ipAddress: string | null;
	userAgent: string | null;
	isRevoked: boolean;
}[]> {
	try {
		const sessions = await db
			.select({
				id: adminSessions.id,
				createdAt: adminSessions.createdAt,
				lastActivityAt: adminSessions.lastActivityAt,
				ipAddress: adminSessions.ipAddress,
				userAgent: adminSessions.userAgent,
				isRevoked: adminSessions.isRevoked,
				expiresAt: adminSessions.expiresAt
			})
			.from(adminSessions)
			.where(eq(adminSessions.isRevoked, false))
			.orderBy(desc(adminSessions.lastActivityAt));

		// Filter out expired sessions and map to correct types
		const now = new Date();
		return sessions
			.filter(s => new Date(s.expiresAt) > now)
			.map(s => ({
				id: s.id,
				createdAt: s.createdAt ?? now.toISOString(),
				lastActivityAt: s.lastActivityAt,
				ipAddress: s.ipAddress,
				userAgent: s.userAgent,
				isRevoked: s.isRevoked ?? false
			}));
	} catch (error) {
		console.error('Get active sessions error:', error);
		return [];
	}
}

/**
 * Revoke a specific session by ID
 */
export async function revokeSessionById(sessionId: string): Promise<boolean> {
	try {
		await db.update(adminSessions)
			.set({ isRevoked: true })
			.where(eq(adminSessions.id, sessionId));
		return true;
	} catch (error) {
		console.error('Revoke session by ID error:', error);
		return false;
	}
}

/**
 * Get blocked IPs
 */
export async function getBlockedIps(): Promise<{
	id: string;
	ipAddress: string;
	reason: string;
	blockedAt: string;
	expiresAt: string | null;
	failedAttempts: number | null;
}[]> {
	try {
		const blocks = await db
			.select()
			.from(ipBlocklist)
			.orderBy(desc(ipBlocklist.blockedAt));

		// Filter out expired blocks and map to correct types
		const now = new Date();
		return blocks
			.filter(b => !b.expiresAt || new Date(b.expiresAt) > now)
			.map(b => ({
				id: b.id,
				ipAddress: b.ipAddress,
				reason: b.reason,
				blockedAt: b.blockedAt ?? now.toISOString(),
				expiresAt: b.expiresAt,
				failedAttempts: b.failedAttempts
			}));
	} catch (error) {
		console.error('Get blocked IPs error:', error);
		return [];
	}
}

/**
 * Unblock an IP address
 */
export async function unblockIp(ipAddress: string): Promise<boolean> {
	try {
		await db.delete(ipBlocklist)
			.where(eq(ipBlocklist.ipAddress, ipAddress));

		await logSecurityEvent('ip_unblocked', ipAddress, null, { manual: true });
		return true;
	} catch (error) {
		console.error('Unblock IP error:', error);
		return false;
	}
}
