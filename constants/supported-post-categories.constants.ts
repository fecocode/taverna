const categoriesData = [
  { name: 'News', route: 'news' },
  { name: 'Life Style', route: 'life-style' },
  { name: 'Book Recommendations', route: 'book-recommendations' },
  { name: 'Random', route: 'random' },
  { name: 'Product Review', route: 'product-review' },
  { name: 'Development', route: 'development' },
  { name: 'Legal', route: 'legal' },
  { name: 'Marketing', route: 'marketing' },
  { name: 'SEO', route: 'seo' },
  { name: 'Market Research', route: 'market-research' },
  { name: 'Cloud Computing', route: 'cloud-computing' },
  { name: 'Cybersecurity', route: 'cybersecurity' },
  { name: 'Artificial Intelligence', route: 'artificial-intelligence' },
  { name: 'Blockchain', route: 'blockchain' },
  { name: 'Fundraising', route: 'fundraising' },
  { name: 'Finances', route: 'finances' },
  { name: 'Productivity', route: 'productivity' },
  { name: 'Health and Wellness', route: 'health-and-wellness' },
  { name: 'Networking', route: 'networking' },
  { name: 'Sustainability', route: 'sustainability' },
  { name: 'Customer Experience', route: 'customer-experience' },
  { name: 'Self-Education', route: 'self-education' },
  { name: 'Growth Strategies', route: 'growth-strategies' },
  { name: 'Analytics and Reporting', route: 'analytics-and-reporting' },
  { name: 'Shipping and Fulfillment', route: 'shipping-and-fulfillment' },
  { name: 'No-code', route: 'no-code' },
  { name: 'Low-code', route: 'low-code' },
  { name: 'New ideas', route: 'new-ideas' },
]

export function getRouteOfCategory(category: string) {
  return categoriesData.find(c => c.name === category)?.route || ''
}

export default categoriesData