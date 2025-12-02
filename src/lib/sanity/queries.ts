import groq from 'groq';

// Base trader fields projection
const traderFields = groq`
	_id,
	_createdAt,
	_updatedAt,
	name,
	"slug": slug.current,
	"photoUrl": photo.asset->url,
	oneLiner,
	birthYear,
	deathYear,
	nationality,
	tradingStyle,
	netWorth,
	bio,
	philosophy,
	achievements,
	famousTrades[] {
		date,
		asset,
		position,
		outcome,
		profitLoss,
		description
	},
	quotes[] {
		text,
		source
	},
	books[] {
		title,
		year,
		description
	},
	socialLinks[] {
		platform,
		url
	},
	status
`;

// Get all published traders
export const allTradersQuery = groq`
	*[_type == "trader" && status == "published"] | order(_createdAt desc) {
		${traderFields}
	}
`;

// Get all traders (including drafts) for admin
export const allTradersAdminQuery = groq`
	*[_type == "trader"] | order(_createdAt desc) {
		${traderFields}
	}
`;

// Get a single trader by slug
export const traderBySlugQuery = groq`
	*[_type == "trader" && slug.current == $slug][0] {
		${traderFields}
	}
`;

// Get a single trader by ID
export const traderByIdQuery = groq`
	*[_type == "trader" && _id == $id][0] {
		${traderFields}
	}
`;

// Get related traders by trading style (excluding current trader)
export const relatedTradersQuery = groq`
	*[_type == "trader" && status == "published" && tradingStyle == $tradingStyle && slug.current != $currentSlug][0...3] {
		${traderFields}
	}
`;

// Get traders by trading style
export const tradersByStyleQuery = groq`
	*[_type == "trader" && status == "published" && tradingStyle match $style] | order(_createdAt desc) {
		${traderFields}
	}
`;

// Get unique trading styles
export const tradingStylesQuery = groq`
	array::unique(*[_type == "trader" && status == "published" && defined(tradingStyle)].tradingStyle)
`;

// Get featured trader (most recent published)
export const featuredTraderQuery = groq`
	*[_type == "trader" && status == "published"] | order(_createdAt desc)[0] {
		${traderFields}
	}
`;

// Get trader count stats for admin
export const traderStatsQuery = groq`
	{
		"total": count(*[_type == "trader"]),
		"published": count(*[_type == "trader" && status == "published"]),
		"drafts": count(*[_type == "trader" && status == "draft"])
	}
`;

// Get recent traders for admin dashboard
export const recentTradersQuery = groq`
	*[_type == "trader"] | order(_createdAt desc)[0...5] {
		${traderFields}
	}
`;
