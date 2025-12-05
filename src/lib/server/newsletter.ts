// ============================================================================
// NEWSLETTER SERVICE
// Comprehensive email marketing system with tracking
// ============================================================================

import { Resend } from 'resend';
import { db } from './db';
import {
	newsletterSubscribers,
	newsletterCampaigns,
	newsletterEvents,
	newsletterSendLog,
	DEFAULT_SUBSCRIBER_PREFERENCES,
	type NewsletterSubscriber,
	type NewNewsletterSubscriber,
	type NewsletterCampaign,
	type NewNewsletterCampaign,
	type NewsletterEvent,
	type NewsletterEventType,
	type SubscriberStatus,
	type SubscriberPreferences,
	type CampaignStatus,
	type SendStatus
} from './schema';
import { eq, and, desc, sql, count, gte } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

// ============================================================================
// CONFIGURATION
// ============================================================================

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

const SITE_URL = publicEnv.PUBLIC_SITE_URL || 'http://localhost:5173';
const SITE_NAME = publicEnv.PUBLIC_SITE_NAME || 'Trading Greats';
const FROM_EMAIL = env.NEWSLETTER_FROM_EMAIL || 'newsletter@tradinggreats.com';
const FROM_NAME = env.NEWSLETTER_FROM_NAME || 'Trading Greats';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateToken(): string {
	const array = new Uint8Array(32);
	crypto.getRandomValues(array);
	return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function parseUserAgent(userAgent: string | null): { device: string; emailClient: string } {
	if (!userAgent) return { device: 'unknown', emailClient: 'unknown' };

	const ua = userAgent.toLowerCase();

	// Device detection
	let device = 'desktop';
	if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
		device = 'mobile';
	} else if (ua.includes('tablet') || ua.includes('ipad')) {
		device = 'tablet';
	}

	// Email client detection
	let emailClient = 'unknown';
	if (ua.includes('gmail') || ua.includes('googleimageproxy')) {
		emailClient = 'gmail';
	} else if (ua.includes('outlook') || ua.includes('microsoft')) {
		emailClient = 'outlook';
	} else if (ua.includes('apple') || ua.includes('webkit')) {
		emailClient = 'apple_mail';
	} else if (ua.includes('yahoo')) {
		emailClient = 'yahoo';
	} else if (ua.includes('thunderbird')) {
		emailClient = 'thunderbird';
	}

	return { device, emailClient };
}

// ============================================================================
// SUBSCRIBER MANAGEMENT
// ============================================================================

export async function subscribeEmail(
	email: string,
	options: {
		source?: string;
		referrer?: string;
		ipAddress?: string;
		userAgent?: string;
		preferences?: Partial<SubscriberPreferences>;
	} = {}
): Promise<{ success: boolean; message: string; requiresVerification: boolean }> {
	const normalizedEmail = email.toLowerCase().trim();

	// Validate email format
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(normalizedEmail)) {
		return { success: false, message: 'Invalid email format', requiresVerification: false };
	}

	// Check if already subscribed
	const existing = await db
		.select()
		.from(newsletterSubscribers)
		.where(eq(newsletterSubscribers.email, normalizedEmail))
		.get();

	if (existing) {
		if (existing.status === 'verified') {
			return { success: false, message: 'Email already subscribed', requiresVerification: false };
		}
		if (existing.status === 'pending') {
			// Resend verification
			await sendVerificationEmail(existing);
			return { success: true, message: 'Verification email resent', requiresVerification: true };
		}
		if (existing.status === 'unsubscribed') {
			// Resubscribe
			const verificationToken = generateToken();
			await db
				.update(newsletterSubscribers)
				.set({
					status: 'pending',
					verificationToken,
					unsubscribedAt: null,
					unsubscribeReason: null,
					updatedAt: new Date().toISOString()
				})
				.where(eq(newsletterSubscribers.id, existing.id));

			const updatedSubscriber = await db
				.select()
				.from(newsletterSubscribers)
				.where(eq(newsletterSubscribers.id, existing.id))
				.get();

			if (updatedSubscriber) {
				await sendVerificationEmail(updatedSubscriber);
			}
			return { success: true, message: 'Please verify your email', requiresVerification: true };
		}
	}

	// Create new subscriber
	const verificationToken = generateToken();
	const preferences = { ...DEFAULT_SUBSCRIBER_PREFERENCES, ...options.preferences };

	const newSubscriber: NewNewsletterSubscriber = {
		email: normalizedEmail,
		status: 'pending',
		verificationToken,
		preferences,
		source: options.source,
		referrer: options.referrer,
		ipAddress: options.ipAddress,
		userAgent: options.userAgent
	};

	await db.insert(newsletterSubscribers).values(newSubscriber);

	const subscriber = await db
		.select()
		.from(newsletterSubscribers)
		.where(eq(newsletterSubscribers.email, normalizedEmail))
		.get();

	if (subscriber) {
		await sendVerificationEmail(subscriber);
	}

	return { success: true, message: 'Please check your email to verify', requiresVerification: true };
}

export async function verifySubscriber(
	token: string
): Promise<{ success: boolean; message: string }> {
	const subscriber = await db
		.select()
		.from(newsletterSubscribers)
		.where(eq(newsletterSubscribers.verificationToken, token))
		.get();

	if (!subscriber) {
		return { success: false, message: 'Invalid or expired verification link' };
	}

	if (subscriber.status === 'verified') {
		return { success: true, message: 'Email already verified' };
	}

	await db
		.update(newsletterSubscribers)
		.set({
			status: 'verified',
			verifiedAt: new Date().toISOString(),
			verificationToken: null,
			updatedAt: new Date().toISOString()
		})
		.where(eq(newsletterSubscribers.id, subscriber.id));

	// Send welcome email
	const updatedSubscriber = await db
		.select()
		.from(newsletterSubscribers)
		.where(eq(newsletterSubscribers.id, subscriber.id))
		.get();

	if (updatedSubscriber) {
		await sendWelcomeEmail(updatedSubscriber);
	}

	return { success: true, message: 'Email verified successfully!' };
}

export async function unsubscribeByToken(
	token: string,
	reason?: string
): Promise<{ success: boolean; message: string }> {
	const subscriber = await db
		.select()
		.from(newsletterSubscribers)
		.where(eq(newsletterSubscribers.unsubscribeToken, token))
		.get();

	if (!subscriber) {
		return { success: false, message: 'Invalid unsubscribe link' };
	}

	if (subscriber.status === 'unsubscribed') {
		return { success: true, message: 'Already unsubscribed' };
	}

	await db
		.update(newsletterSubscribers)
		.set({
			status: 'unsubscribed',
			unsubscribedAt: new Date().toISOString(),
			unsubscribeReason: reason,
			updatedAt: new Date().toISOString()
		})
		.where(eq(newsletterSubscribers.id, subscriber.id));

	return { success: true, message: 'Successfully unsubscribed' };
}

export async function updateSubscriberPreferences(
	token: string,
	preferences: Partial<SubscriberPreferences>
): Promise<{ success: boolean; message: string }> {
	const subscriber = await db
		.select()
		.from(newsletterSubscribers)
		.where(eq(newsletterSubscribers.unsubscribeToken, token))
		.get();

	if (!subscriber) {
		return { success: false, message: 'Invalid preferences link' };
	}

	const currentPreferences = subscriber.preferences || DEFAULT_SUBSCRIBER_PREFERENCES;
	const updatedPreferences = { ...currentPreferences, ...preferences };

	await db
		.update(newsletterSubscribers)
		.set({
			preferences: updatedPreferences,
			updatedAt: new Date().toISOString()
		})
		.where(eq(newsletterSubscribers.id, subscriber.id));

	return { success: true, message: 'Preferences updated successfully' };
}

export async function getSubscriberByEmail(email: string): Promise<NewsletterSubscriber | null> {
	const subscriber = await db
		.select()
		.from(newsletterSubscribers)
		.where(eq(newsletterSubscribers.email, email.toLowerCase().trim()))
		.get();

	return subscriber || null;
}

export async function getSubscriberByToken(token: string): Promise<NewsletterSubscriber | null> {
	const subscriber = await db
		.select()
		.from(newsletterSubscribers)
		.where(eq(newsletterSubscribers.unsubscribeToken, token))
		.get();

	return subscriber || null;
}

export async function getAllSubscribers(options: {
	status?: SubscriberStatus;
	limit?: number;
	offset?: number;
}): Promise<{ subscribers: NewsletterSubscriber[]; total: number }> {
	let query = db.select().from(newsletterSubscribers);

	if (options.status) {
		query = query.where(eq(newsletterSubscribers.status, options.status)) as typeof query;
	}

	const subscribers = await query
		.orderBy(desc(newsletterSubscribers.createdAt))
		.limit(options.limit || 50)
		.offset(options.offset || 0);

	// Get total count
	let countQuery = db.select({ count: count() }).from(newsletterSubscribers);
	if (options.status) {
		countQuery = countQuery.where(eq(newsletterSubscribers.status, options.status)) as typeof countQuery;
	}
	const totalResult = await countQuery.get();
	const total = totalResult?.count || 0;

	return { subscribers, total };
}

export async function deleteSubscriber(id: string): Promise<boolean> {
	await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.id, id));
	return true;
}

// ============================================================================
// EMAIL SENDING
// ============================================================================

async function sendVerificationEmail(subscriber: NewsletterSubscriber): Promise<boolean> {
	if (!resend) {
		console.log('[Newsletter] Resend not configured. Verification email would be sent to:', subscriber.email);
		console.log('[Newsletter] Verification link:', `${SITE_URL}/newsletter/verify/${subscriber.verificationToken}`);
		return true;
	}

	const verifyUrl = `${SITE_URL}/newsletter/verify/${subscriber.verificationToken}`;

	try {
		await resend.emails.send({
			from: `${FROM_NAME} <${FROM_EMAIL}>`,
			to: subscriber.email,
			subject: `Verify your subscription to ${SITE_NAME}`,
			html: generateVerificationEmailHtml(verifyUrl),
			text: `Please verify your email by clicking this link: ${verifyUrl}`
		});
		return true;
	} catch (error) {
		console.error('[Newsletter] Failed to send verification email:', error);
		return false;
	}
}

async function sendWelcomeEmail(subscriber: NewsletterSubscriber): Promise<boolean> {
	if (!resend) {
		console.log('[Newsletter] Resend not configured. Welcome email would be sent to:', subscriber.email);
		return true;
	}

	const unsubscribeUrl = `${SITE_URL}/newsletter/unsubscribe/${subscriber.unsubscribeToken}`;
	const preferencesUrl = `${SITE_URL}/newsletter/preferences/${subscriber.unsubscribeToken}`;

	try {
		await resend.emails.send({
			from: `${FROM_NAME} <${FROM_EMAIL}>`,
			to: subscriber.email,
			subject: `Welcome to ${SITE_NAME}!`,
			html: generateWelcomeEmailHtml(unsubscribeUrl, preferencesUrl),
			text: `Welcome to ${SITE_NAME}! You're now subscribed to receive trading insights from legendary investors.`
		});
		return true;
	} catch (error) {
		console.error('[Newsletter] Failed to send welcome email:', error);
		return false;
	}
}

export async function sendCampaign(campaignId: string): Promise<{ success: boolean; message: string; sent: number }> {
	const campaign = await db
		.select()
		.from(newsletterCampaigns)
		.where(eq(newsletterCampaigns.id, campaignId))
		.get();

	if (!campaign) {
		return { success: false, message: 'Campaign not found', sent: 0 };
	}

	if (campaign.status === 'sent' || campaign.status === 'sending') {
		return { success: false, message: 'Campaign already sent or sending', sent: 0 };
	}

	// Get verified subscribers
	const subscribers = await db
		.select()
		.from(newsletterSubscribers)
		.where(eq(newsletterSubscribers.status, 'verified'));

	if (subscribers.length === 0) {
		return { success: false, message: 'No verified subscribers', sent: 0 };
	}

	// Update campaign status
	await db
		.update(newsletterCampaigns)
		.set({
			status: 'sending',
			totalRecipients: subscribers.length,
			updatedAt: new Date().toISOString()
		})
		.where(eq(newsletterCampaigns.id, campaignId));

	let sentCount = 0;

	// Send to each subscriber
	for (const subscriber of subscribers) {
		const sent = await sendCampaignToSubscriber(campaign, subscriber);
		if (sent) sentCount++;
	}

	// Update campaign as sent
	await db
		.update(newsletterCampaigns)
		.set({
			status: 'sent',
			sentAt: new Date().toISOString(),
			completedAt: new Date().toISOString(),
			totalSent: sentCount,
			updatedAt: new Date().toISOString()
		})
		.where(eq(newsletterCampaigns.id, campaignId));

	return { success: true, message: `Campaign sent to ${sentCount} subscribers`, sent: sentCount };
}

async function sendCampaignToSubscriber(
	campaign: NewsletterCampaign,
	subscriber: NewsletterSubscriber
): Promise<boolean> {
	// Create send log entry
	const sendLog = await db
		.insert(newsletterSendLog)
		.values({
			subscriberId: subscriber.id,
			campaignId: campaign.id,
			status: 'pending'
		})
		.returning()
		.get();

	if (!sendLog) return false;

	// Generate tracking URLs
	const trackingPixelUrl = `${SITE_URL}/api/newsletter/track/open/${sendLog.id}`;
	const unsubscribeUrl = `${SITE_URL}/newsletter/unsubscribe/${subscriber.unsubscribeToken}`;
	const preferencesUrl = `${SITE_URL}/newsletter/preferences/${subscriber.unsubscribeToken}`;

	// Add tracking pixel and replace links with tracked versions
	const trackedContent = addTrackingToContent(campaign.content, sendLog.id, campaign.id, subscriber.id);
	const htmlWithPixel = `${trackedContent}<img src="${trackingPixelUrl}" width="1" height="1" style="display:none" alt="" />`;

	// Add footer with unsubscribe link
	const finalHtml = wrapEmailHtml(htmlWithPixel, unsubscribeUrl, preferencesUrl);

	if (!resend) {
		console.log(`[Newsletter] Would send campaign "${campaign.subject}" to ${subscriber.email}`);
		// Update send log
		await db
			.update(newsletterSendLog)
			.set({
				status: 'sent',
				sentAt: new Date().toISOString()
			})
			.where(eq(newsletterSendLog.id, sendLog.id));

		// Record sent event
		await recordEvent({
			subscriberId: subscriber.id,
			campaignId: campaign.id,
			eventType: 'sent'
		});

		// Update subscriber stats
		await db
			.update(newsletterSubscribers)
			.set({
				totalEmailsSent: sql`${newsletterSubscribers.totalEmailsSent} + 1`,
				updatedAt: new Date().toISOString()
			})
			.where(eq(newsletterSubscribers.id, subscriber.id));

		return true;
	}

	try {
		const result = await resend.emails.send({
			from: `${FROM_NAME} <${FROM_EMAIL}>`,
			to: subscriber.email,
			subject: campaign.subject,
			html: finalHtml,
			text: campaign.contentText || stripHtml(campaign.content),
			headers: {
				'List-Unsubscribe': `<${unsubscribeUrl}>`,
				'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
			}
		});

		// Update send log
		await db
			.update(newsletterSendLog)
			.set({
				status: 'sent',
				sentAt: new Date().toISOString(),
				providerMessageId: result.data?.id
			})
			.where(eq(newsletterSendLog.id, sendLog.id));

		// Record sent event
		await recordEvent({
			subscriberId: subscriber.id,
			campaignId: campaign.id,
			eventType: 'sent'
		});

		// Update subscriber stats
		await db
			.update(newsletterSubscribers)
			.set({
				totalEmailsSent: sql`${newsletterSubscribers.totalEmailsSent} + 1`,
				updatedAt: new Date().toISOString()
			})
			.where(eq(newsletterSubscribers.id, subscriber.id));

		return true;
	} catch (error) {
		console.error(`[Newsletter] Failed to send to ${subscriber.email}:`, error);

		await db
			.update(newsletterSendLog)
			.set({
				status: 'failed',
				errorMessage: error instanceof Error ? error.message : 'Unknown error'
			})
			.where(eq(newsletterSendLog.id, sendLog.id));

		return false;
	}
}

function addTrackingToContent(html: string, sendLogId: string, campaignId: string, subscriberId: string): string {
	// Replace all links with tracked versions
	const linkRegex = /<a\s+([^>]*href=["'])([^"']+)(["'][^>]*)>/gi;

	return html.replace(linkRegex, (match, prefix, url, suffix) => {
		// Don't track unsubscribe or preferences links
		if (url.includes('/newsletter/unsubscribe') || url.includes('/newsletter/preferences')) {
			return match;
		}

		const trackedUrl = `${SITE_URL}/api/newsletter/track/click/${sendLogId}?url=${encodeURIComponent(url)}&cid=${campaignId}&sid=${subscriberId}`;
		return `<a ${prefix}${trackedUrl}${suffix}>`;
	});
}

function stripHtml(html: string): string {
	return html
		.replace(/<[^>]*>/g, '')
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/\s+/g, ' ')
		.trim();
}

// ============================================================================
// TRACKING
// ============================================================================

export async function trackOpen(
	sendLogId: string,
	metadata: { ipAddress?: string; userAgent?: string } = {}
): Promise<void> {
	const sendLog = await db
		.select()
		.from(newsletterSendLog)
		.where(eq(newsletterSendLog.id, sendLogId))
		.get();

	if (!sendLog) return;

	const { device, emailClient } = parseUserAgent(metadata.userAgent || null);
	const now = new Date().toISOString();

	// Record event
	await recordEvent({
		subscriberId: sendLog.subscriberId,
		campaignId: sendLog.campaignId,
		eventType: 'opened',
		ipAddress: metadata.ipAddress,
		userAgent: metadata.userAgent,
		device,
		emailClient
	});

	// Update send log (first open only)
	if (!sendLog.hasOpened) {
		await db
			.update(newsletterSendLog)
			.set({
				hasOpened: true,
				openedAt: now
			})
			.where(eq(newsletterSendLog.id, sendLogId));

		// Update campaign unique opens
		await db
			.update(newsletterCampaigns)
			.set({
				uniqueOpens: sql`${newsletterCampaigns.uniqueOpens} + 1`,
				updatedAt: now
			})
			.where(eq(newsletterCampaigns.id, sendLog.campaignId));
	}

	// Update campaign total opens
	await db
		.update(newsletterCampaigns)
		.set({
			totalOpens: sql`${newsletterCampaigns.totalOpens} + 1`,
			updatedAt: now
		})
		.where(eq(newsletterCampaigns.id, sendLog.campaignId));

	// Update subscriber stats
	await db
		.update(newsletterSubscribers)
		.set({
			totalOpens: sql`${newsletterSubscribers.totalOpens} + 1`,
			lastOpenedAt: now,
			updatedAt: now
		})
		.where(eq(newsletterSubscribers.id, sendLog.subscriberId));
}

export async function trackClick(
	sendLogId: string,
	url: string,
	metadata: { ipAddress?: string; userAgent?: string } = {}
): Promise<string> {
	const sendLog = await db
		.select()
		.from(newsletterSendLog)
		.where(eq(newsletterSendLog.id, sendLogId))
		.get();

	if (!sendLog) return url;

	const { device, emailClient } = parseUserAgent(metadata.userAgent || null);
	const now = new Date().toISOString();

	// Record event
	await recordEvent({
		subscriberId: sendLog.subscriberId,
		campaignId: sendLog.campaignId,
		eventType: 'clicked',
		linkUrl: url,
		ipAddress: metadata.ipAddress,
		userAgent: metadata.userAgent,
		device,
		emailClient
	});

	// Update send log (first click only)
	if (!sendLog.hasClicked) {
		await db
			.update(newsletterSendLog)
			.set({
				hasClicked: true,
				clickedAt: now
			})
			.where(eq(newsletterSendLog.id, sendLogId));

		// Update campaign unique clicks
		await db
			.update(newsletterCampaigns)
			.set({
				uniqueClicks: sql`${newsletterCampaigns.uniqueClicks} + 1`,
				updatedAt: now
			})
			.where(eq(newsletterCampaigns.id, sendLog.campaignId));
	}

	// Update campaign total clicks
	await db
		.update(newsletterCampaigns)
		.set({
			totalClicks: sql`${newsletterCampaigns.totalClicks} + 1`,
			updatedAt: now
		})
		.where(eq(newsletterCampaigns.id, sendLog.campaignId));

	// Update subscriber stats
	await db
		.update(newsletterSubscribers)
		.set({
			totalClicks: sql`${newsletterSubscribers.totalClicks} + 1`,
			lastClickedAt: now,
			updatedAt: now
		})
		.where(eq(newsletterSubscribers.id, sendLog.subscriberId));

	return url;
}

async function recordEvent(event: {
	subscriberId: string;
	campaignId: string;
	eventType: NewsletterEventType;
	linkUrl?: string;
	linkText?: string;
	ipAddress?: string;
	userAgent?: string;
	device?: string;
	emailClient?: string;
}): Promise<void> {
	await db.insert(newsletterEvents).values(event);
}

// ============================================================================
// CAMPAIGN MANAGEMENT
// ============================================================================

export async function createCampaign(data: {
	subject: string;
	previewText?: string;
	content: string;
	contentText?: string;
	type?: 'manual' | 'weekly_digest' | 'new_trader' | 'blog_post';
}): Promise<NewsletterCampaign | null> {
	const campaign = await db
		.insert(newsletterCampaigns)
		.values({
			subject: data.subject,
			previewText: data.previewText,
			content: data.content,
			contentText: data.contentText || stripHtml(data.content),
			type: data.type || 'manual',
			status: 'draft'
		})
		.returning()
		.get();

	return campaign || null;
}

export async function updateCampaign(
	id: string,
	data: Partial<{
		subject: string;
		previewText: string;
		content: string;
		contentText: string;
		status: CampaignStatus;
	}>
): Promise<boolean> {
	const result = await db
		.update(newsletterCampaigns)
		.set({
			...data,
			updatedAt: new Date().toISOString()
		})
		.where(eq(newsletterCampaigns.id, id));

	return true;
}

export async function deleteCampaign(id: string): Promise<boolean> {
	const campaign = await db
		.select()
		.from(newsletterCampaigns)
		.where(eq(newsletterCampaigns.id, id))
		.get();

	if (!campaign || campaign.status === 'sent' || campaign.status === 'sending') {
		return false;
	}

	await db.delete(newsletterCampaigns).where(eq(newsletterCampaigns.id, id));
	return true;
}

export async function getCampaign(id: string): Promise<NewsletterCampaign | null> {
	const campaign = await db
		.select()
		.from(newsletterCampaigns)
		.where(eq(newsletterCampaigns.id, id))
		.get();

	return campaign || null;
}

export async function getAllCampaigns(options: {
	status?: CampaignStatus;
	limit?: number;
	offset?: number;
}): Promise<{ campaigns: NewsletterCampaign[]; total: number }> {
	let query = db.select().from(newsletterCampaigns);

	if (options.status) {
		query = query.where(eq(newsletterCampaigns.status, options.status)) as typeof query;
	}

	const campaigns = await query
		.orderBy(desc(newsletterCampaigns.createdAt))
		.limit(options.limit || 50)
		.offset(options.offset || 0);

	// Get total count
	let countQuery = db.select({ count: count() }).from(newsletterCampaigns);
	if (options.status) {
		countQuery = countQuery.where(eq(newsletterCampaigns.status, options.status)) as typeof countQuery;
	}
	const totalResult = await countQuery.get();
	const total = totalResult?.count || 0;

	return { campaigns, total };
}

// ============================================================================
// STATISTICS
// ============================================================================

export async function getNewsletterStats(): Promise<{
	totalSubscribers: number;
	verifiedSubscribers: number;
	pendingSubscribers: number;
	unsubscribedCount: number;
	totalCampaigns: number;
	sentCampaigns: number;
	avgOpenRate: number;
	avgClickRate: number;
	subscribersLast30Days: number;
	unsubscribesLast30Days: number;
}> {
	const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

	// Subscriber counts
	const totalResult = await db.select({ count: count() }).from(newsletterSubscribers).get();
	const verifiedResult = await db
		.select({ count: count() })
		.from(newsletterSubscribers)
		.where(eq(newsletterSubscribers.status, 'verified'))
		.get();
	const pendingResult = await db
		.select({ count: count() })
		.from(newsletterSubscribers)
		.where(eq(newsletterSubscribers.status, 'pending'))
		.get();
	const unsubscribedResult = await db
		.select({ count: count() })
		.from(newsletterSubscribers)
		.where(eq(newsletterSubscribers.status, 'unsubscribed'))
		.get();

	// Campaign counts
	const totalCampaignsResult = await db.select({ count: count() }).from(newsletterCampaigns).get();
	const sentCampaignsResult = await db
		.select({ count: count() })
		.from(newsletterCampaigns)
		.where(eq(newsletterCampaigns.status, 'sent'))
		.get();

	// Calculate average rates from sent campaigns
	const sentCampaigns = await db
		.select()
		.from(newsletterCampaigns)
		.where(eq(newsletterCampaigns.status, 'sent'));

	let totalOpenRate = 0;
	let totalClickRate = 0;
	let campaignsWithData = 0;

	for (const campaign of sentCampaigns) {
		if (campaign.totalSent && campaign.totalSent > 0) {
			totalOpenRate += (campaign.uniqueOpens || 0) / campaign.totalSent;
			totalClickRate += (campaign.uniqueClicks || 0) / campaign.totalSent;
			campaignsWithData++;
		}
	}

	const avgOpenRate = campaignsWithData > 0 ? (totalOpenRate / campaignsWithData) * 100 : 0;
	const avgClickRate = campaignsWithData > 0 ? (totalClickRate / campaignsWithData) * 100 : 0;

	// Last 30 days stats
	const newSubscribersResult = await db
		.select({ count: count() })
		.from(newsletterSubscribers)
		.where(gte(newsletterSubscribers.createdAt, thirtyDaysAgo))
		.get();

	const recentUnsubscribesResult = await db
		.select({ count: count() })
		.from(newsletterSubscribers)
		.where(
			and(
				eq(newsletterSubscribers.status, 'unsubscribed'),
				gte(newsletterSubscribers.unsubscribedAt, thirtyDaysAgo)
			)
		)
		.get();

	return {
		totalSubscribers: totalResult?.count || 0,
		verifiedSubscribers: verifiedResult?.count || 0,
		pendingSubscribers: pendingResult?.count || 0,
		unsubscribedCount: unsubscribedResult?.count || 0,
		totalCampaigns: totalCampaignsResult?.count || 0,
		sentCampaigns: sentCampaignsResult?.count || 0,
		avgOpenRate: Math.round(avgOpenRate * 10) / 10,
		avgClickRate: Math.round(avgClickRate * 10) / 10,
		subscribersLast30Days: newSubscribersResult?.count || 0,
		unsubscribesLast30Days: recentUnsubscribesResult?.count || 0
	};
}

export async function getCampaignEvents(
	campaignId: string,
	options: { limit?: number; offset?: number } = {}
): Promise<NewsletterEvent[]> {
	return await db
		.select()
		.from(newsletterEvents)
		.where(eq(newsletterEvents.campaignId, campaignId))
		.orderBy(desc(newsletterEvents.timestamp))
		.limit(options.limit || 100)
		.offset(options.offset || 0);
}

// ============================================================================
// EMAIL TEMPLATES
// ============================================================================

function generateVerificationEmailHtml(verifyUrl: string): string {
	return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0f;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0f; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #12121a; border-radius: 16px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 1px solid rgba(212, 175, 55, 0.2);">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #d4af37;">${SITE_NAME}</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; font-size: 24px; font-weight: 600; color: #ffffff;">Verify Your Email</h2>
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #9ca3af;">
                Thank you for subscribing to ${SITE_NAME}! Please verify your email address to start receiving trading insights from legendary investors.
              </p>
              <a href="${verifyUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(to right, #d4af37, #b8962e); color: #0a0a0f; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 8px;">
                Verify Email Address
              </a>
              <p style="margin: 30px 0 0; font-size: 14px; color: #6b7280;">
                Or copy this link: <a href="${verifyUrl}" style="color: #d4af37;">${verifyUrl}</a>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
              <p style="margin: 0; font-size: 12px; color: #6b7280;">
                If you didn't subscribe, you can safely ignore this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function generateWelcomeEmailHtml(unsubscribeUrl: string, preferencesUrl: string): string {
	return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ${SITE_NAME}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0f;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0f; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #12121a; border-radius: 16px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 1px solid rgba(212, 175, 55, 0.2);">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #d4af37;">${SITE_NAME}</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; font-size: 24px; font-weight: 600; color: #ffffff;">Welcome to ${SITE_NAME}! 🎉</h2>
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #9ca3af;">
                You're now part of an exclusive community learning from history's greatest traders.
              </p>
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #9ca3af;">
                Here's what you can expect:
              </p>
              <ul style="margin: 0 0 30px; padding-left: 20px; font-size: 16px; line-height: 1.8; color: #9ca3af;">
                <li>Weekly insights from legendary investors</li>
                <li>Deep dives into proven trading strategies</li>
                <li>New trader profiles and analysis</li>
                <li>Exclusive content not on the website</li>
              </ul>
              <a href="${SITE_URL}/traders" style="display: inline-block; padding: 14px 32px; background: linear-gradient(to right, #d4af37, #b8962e); color: #0a0a0f; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 8px;">
                Explore Trading Legends
              </a>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
              <p style="margin: 0 0 10px; font-size: 12px; color: #6b7280;">
                <a href="${preferencesUrl}" style="color: #d4af37; text-decoration: none;">Manage preferences</a> ·
                <a href="${unsubscribeUrl}" style="color: #6b7280; text-decoration: none;">Unsubscribe</a>
              </p>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">
                © ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function wrapEmailHtml(content: string, unsubscribeUrl: string, preferencesUrl: string): string {
	return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0f;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0f; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #12121a; border-radius: 16px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 30px 40px 20px; text-align: center; border-bottom: 1px solid rgba(212, 175, 55, 0.2);">
              <a href="${SITE_URL}" style="text-decoration: none;">
                <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #d4af37;">${SITE_NAME}</h1>
              </a>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 30px 40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
              <p style="margin: 0 0 10px; font-size: 12px; color: #6b7280;">
                <a href="${preferencesUrl}" style="color: #d4af37; text-decoration: none;">Manage preferences</a> ·
                <a href="${unsubscribeUrl}" style="color: #6b7280; text-decoration: none;">Unsubscribe</a>
              </p>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">
                © ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
