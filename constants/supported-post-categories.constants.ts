const categoriesData = [
  { "name": "Noticias", "route": "news" },
  { "name": "Estilo de Vida", "route": "life-style" },
  { "name": "Recomendaciones de Libros", "route": "book-recommendations" },
  { "name": "Random", "route": "random" },
  { "name": "Reseñas de Productos", "route": "product-review" },
  { "name": "Desarrollo", "route": "development" },
  { "name": "Legal", "route": "legal" },
  { "name": "Marketing", "route": "marketing" },
  { "name": "SEO", "route": "seo" },
  { "name": "Investigación de Mercado", "route": "market-research" },
  { "name": "Infraestructura", "route": "cloud-computing" },
  { "name": "Ciberseguridad", "route": "cybersecurity" },
  { "name": "Inteligencia Artificial", "route": "artificial-intelligence" },
  { "name": "Blockchain", "route": "blockchain" },
  { "name": "Fundraising", "route": "fundraising" },
  { "name": "Finanzas", "route": "finances" },
  { "name": "Productividad", "route": "productivity" },
  { "name": "Salud y Bienestar", "route": "health-and-wellness" },
  { "name": "Networking", "route": "networking" },
  { "name": "Sostenibilidad", "route": "sustainability" },
  { "name": "Experiencia del Cliente", "route": "customer-experience" },
  { "name": "Contenido autodidacta", "route": "self-education" },
  { "name": "Estrategias de Crecimiento", "route": "growth-strategies" },
  { "name": "Analytics", "route": "analytics-and-reporting" },
  { "name": "Lanzamientos y cumplimiento", "route": "shipping-and-fulfillment" },
  { "name": "No-code", "route": "no-code" },
  { "name": "Low-code", "route": "low-code" },
  { "name": "Nuevas Ideas", "route": "new-ideas" }
]

export function getRouteOfCategory(category: string) {
  return categoriesData.find(c => c.name === category)?.route || ''
}

export function getCategoryOfRoute(route: string) {
  return categoriesData.find(c => c.route === route)?.name || undefined
}

export default categoriesData