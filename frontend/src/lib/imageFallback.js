const CATEGORY_FALLBACKS = {
  bollywood:
    "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&auto=format&fit=crop&q=80",
  hollywood:
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80",
  television:
    "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=1200&auto=format&fit=crop&q=80",
  digital:
    "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=1200&auto=format&fit=crop&q=80",
  movies:
    "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&auto=format&fit=crop&q=80",
  stories:
    "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1200&auto=format&fit=crop&q=80",
  blog:
    "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&auto=format&fit=crop&q=80",
}

export const getFallbackImage = (category = "blog") => {
  const key = String(category).toLowerCase().trim()
  return CATEGORY_FALLBACKS[key] || CATEGORY_FALLBACKS.blog
}

export const handleImageError = (e, category = "blog") => {
  const img = e.currentTarget
  if (img.dataset.fallbackApplied) return
  img.dataset.fallbackApplied = "true"
  img.src = getFallbackImage(category)
}
