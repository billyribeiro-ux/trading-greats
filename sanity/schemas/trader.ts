import { defineField, defineType } from 'sanity';

export default defineType({
	name: 'trader',
	title: 'Trader',
	type: 'document',
	groups: [
		{ name: 'basic', title: 'Basic Info', default: true },
		{ name: 'content', title: 'Content' },
		{ name: 'trades', title: 'Famous Trades' },
		{ name: 'quotes', title: 'Quotes & Books' },
		{ name: 'meta', title: 'Meta' }
	],
	fields: [
		// Basic Info Group
		defineField({
			name: 'name',
			title: 'Name',
			type: 'string',
			group: 'basic',
			validation: (Rule) => Rule.required().min(2).max(100)
		}),
		defineField({
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			group: 'basic',
			options: {
				source: 'name',
				maxLength: 96
			},
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'photo',
			title: 'Photo',
			type: 'image',
			group: 'basic',
			options: {
				hotspot: true
			}
		}),
		defineField({
			name: 'oneLiner',
			title: 'One-Liner',
			type: 'string',
			group: 'basic',
			description: 'A brief tagline describing the trader',
			validation: (Rule) => Rule.required().max(200)
		}),
		defineField({
			name: 'nationality',
			title: 'Nationality',
			type: 'string',
			group: 'basic'
		}),
		defineField({
			name: 'birthYear',
			title: 'Birth Year',
			type: 'number',
			group: 'basic',
			validation: (Rule) => Rule.min(1800).max(2010)
		}),
		defineField({
			name: 'deathYear',
			title: 'Death Year',
			type: 'number',
			group: 'basic',
			description: 'Leave empty if still living',
			validation: (Rule) => Rule.min(1800).max(2100)
		}),
		defineField({
			name: 'tradingStyle',
			title: 'Trading Style',
			type: 'string',
			group: 'basic',
			options: {
				list: [
					{ title: 'Value Investing', value: 'Value Investing' },
					{ title: 'Momentum Growth', value: 'Momentum Growth' },
					{ title: 'Macro & Currency', value: 'Macro & Currency' },
					{ title: 'Options & Technical Analysis', value: 'Options & Technical Analysis' },
					{ title: 'Options & Price Action', value: 'Options & Price Action' },
					{ title: 'Day Trading', value: 'Day Trading' },
					{ title: 'Swing Trading', value: 'Swing Trading' },
					{ title: 'Quantitative', value: 'Quantitative' }
				]
			}
		}),
		defineField({
			name: 'netWorth',
			title: 'Net Worth',
			type: 'string',
			group: 'basic',
			description: 'e.g., "$130 billion"'
		}),

		// Content Group
		defineField({
			name: 'bio',
			title: 'Biography',
			type: 'text',
			group: 'content',
			description: 'Supports Markdown formatting',
			rows: 10
		}),
		defineField({
			name: 'philosophy',
			title: 'Trading Philosophy',
			type: 'text',
			group: 'content',
			rows: 4
		}),
		defineField({
			name: 'achievements',
			title: 'Achievements',
			type: 'array',
			group: 'content',
			of: [{ type: 'string' }]
		}),

		// Famous Trades Group
		defineField({
			name: 'famousTrades',
			title: 'Famous Trades',
			type: 'array',
			group: 'trades',
			of: [
				{
					type: 'object',
					name: 'trade',
					title: 'Trade',
					fields: [
						{ name: 'date', title: 'Date', type: 'string' },
						{ name: 'asset', title: 'Asset', type: 'string' },
						{
							name: 'position',
							title: 'Position',
							type: 'string',
							options: {
								list: [
									{ title: 'Long', value: 'long' },
									{ title: 'Short', value: 'short' }
								]
							}
						},
						{ name: 'outcome', title: 'Outcome', type: 'string' },
						{ name: 'profitLoss', title: 'Profit/Loss', type: 'string' },
						{ name: 'description', title: 'Description', type: 'text', rows: 3 }
					],
					preview: {
						select: {
							title: 'asset',
							subtitle: 'profitLoss'
						}
					}
				}
			]
		}),

		// Quotes & Books Group
		defineField({
			name: 'quotes',
			title: 'Notable Quotes',
			type: 'array',
			group: 'quotes',
			of: [
				{
					type: 'object',
					name: 'quote',
					title: 'Quote',
					fields: [
						{ name: 'text', title: 'Quote Text', type: 'text', rows: 3 },
						{ name: 'source', title: 'Source', type: 'string' }
					],
					preview: {
						select: {
							title: 'text',
							subtitle: 'source'
						}
					}
				}
			]
		}),
		defineField({
			name: 'books',
			title: 'Books',
			type: 'array',
			group: 'quotes',
			of: [
				{
					type: 'object',
					name: 'book',
					title: 'Book',
					fields: [
						{ name: 'title', title: 'Title', type: 'string' },
						{ name: 'year', title: 'Year', type: 'number' },
						{ name: 'description', title: 'Description', type: 'text', rows: 2 }
					],
					preview: {
						select: {
							title: 'title',
							subtitle: 'year'
						}
					}
				}
			]
		}),
		defineField({
			name: 'socialLinks',
			title: 'Social Links',
			type: 'array',
			group: 'quotes',
			of: [
				{
					type: 'object',
					name: 'socialLink',
					title: 'Social Link',
					fields: [
						{
							name: 'platform',
							title: 'Platform',
							type: 'string',
							options: {
								list: [
									{ title: 'Twitter', value: 'twitter' },
									{ title: 'LinkedIn', value: 'linkedin' },
									{ title: 'Wikipedia', value: 'wikipedia' },
									{ title: 'Website', value: 'website' }
								]
							}
						},
						{ name: 'url', title: 'URL', type: 'url' }
					],
					preview: {
						select: {
							title: 'platform',
							subtitle: 'url'
						}
					}
				}
			]
		}),

		// Meta Group
		defineField({
			name: 'status',
			title: 'Status',
			type: 'string',
			group: 'meta',
			options: {
				list: [
					{ title: 'Draft', value: 'draft' },
					{ title: 'Published', value: 'published' }
				],
				layout: 'radio'
			},
			initialValue: 'draft'
		})
	],
	preview: {
		select: {
			title: 'name',
			subtitle: 'tradingStyle',
			media: 'photo'
		}
	},
	orderings: [
		{
			title: 'Name',
			name: 'nameAsc',
			by: [{ field: 'name', direction: 'asc' }]
		},
		{
			title: 'Created',
			name: 'createdDesc',
			by: [{ field: '_createdAt', direction: 'desc' }]
		}
	]
});
