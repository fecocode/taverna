const categoriesData = [
  { "name": "JavaScript", "route": "javascript" },
  { "name": "Eventos y Meetups", "route": "events-meetups" },
  { "name": "Proyectos Open Source", "route": "open-source-projects" },
  { "name": "Charlas y Slides", "route": "talks-slides" },
  { "name": "Memes y Humor Dev", "route": "memes-dev" },
  { "name": "Recomendaciones de cervezas", "route": "beer-recommendations" },
  { "name": "Ofertas Laborales", "route": "job-offers" },
  { "name": "Tips y Hacks", "route": "tips-hacks" },
  { "name": "Networking", "route": "networking" },
  { "name": "Noticias y Tendencias", "route": "news-trends" },
  { "name": "Recursos y Herramientas", "route": "resources-tools" },
  { "name": "Aprendizaje y Cursos", "route": "learning-courses" },
  { "name": "Fotos y Comunidad", "route": "community-photos" },
  { "name": "Sugerencias y Feedback", "route": "suggestions-feedback" },
  { "name": "Off-topic", "route": "off-topic" }
]

export function getRouteOfCategory(category: string) {
  return categoriesData.find(c => c.name === category)?.route || ''
}

export function getCategoryOfRoute(route: string) {
  return categoriesData.find(c => c.route === route)?.name || undefined
}

export default categoriesData