import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export function formatDate(date: string): string {
	return new Date(date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

export function truncate(text: string, length: number): string {
	if (text.length <= length) return text;
	return text.slice(0, length).trim() + '...';
}

/**
 * Calculate reading time for content
 * Based on average reading speed of 200-250 words per minute
 */
export function calculateReadingTime(content: string): { minutes: number; text: string } {
	// Strip HTML tags and markdown syntax
	const plainText = content
		.replace(/<[^>]*>/g, '')
		.replace(/#{1,6}\s/g, '')
		.replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1')
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/`{1,3}[^`]+`{1,3}/g, '')
		.trim();

	const wordCount = plainText.split(/\s+/).filter(Boolean).length;
	const wordsPerMinute = 225; // Average reading speed
	const minutes = Math.ceil(wordCount / wordsPerMinute);

	return {
		minutes,
		text: minutes === 1 ? '1 min read' : `${minutes} min read`
	};
}
