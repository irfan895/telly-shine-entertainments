import crypto from "crypto"
import { XMLParser } from "fast-xml-parser"
import Post from "../models/post.model.js"
import { extractText, normalizeCategory } from "./normalize.js"

const CATEGORY_FALLBACK_IMAGES = {
  bollywood: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&auto=format&fit=crop&q=80",
  hollywood: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80",
  television: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=1200&auto=format&fit=crop&q=80",
  digital: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=1200&auto=format&fit=crop&q=80",
  movies: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&auto=format&fit=crop&q=80",
  stories: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1200&auto=format&fit=crop&q=80",
  blog: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&auto=format&fit=crop&q=80",
}

const RSS_SOURCES = [
  {
    url: "https://www.bollywoodhungama.com/rss/news.xml",
    category: "Bollywood",
    limit: 6,
    markFeatured: true,
    markBreaking: true,
  },
  {
    url: "https://variety.com/feed/",
    category: "Hollywood",
    limit: 6,
    markFeatured: true,
    markTrending: true,
  },
  {
    url: "https://timesofindia.indiatimes.com/rssfeeds/1081479906.cms",
    category: "Television",
    limit: 6,
    markTrending: true,
  },
  {
    url: "https://www.bollywoodhungama.com/rss/features.xml",
    category: "Stories",
    limit: 5,
  },
  {
    url: "https://variety.com/v/film/feed/",
    category: "Movies",
    limit: 5,
  },
  {
    url: "https://www.hollywoodreporter.com/c/movies/feed/",
    category: "Celebrity News",
    limit: 5,
  },
  {
    url: "https://variety.com/v/tv/feed/",
    category: "Blog",
    limit: 4,
  },
  {
    url: "https://variety.com/v/digital/feed/",
    category: "Digital",
    limit: 5,
  },
]

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
})

const stripHtml = (raw = "") =>
  extractText(raw, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()

const extractImage = (item, catSlug) => {
  if (item?.enclosure?.["@_url"]) return extractText(item.enclosure["@_url"])
  const media = item?.["media:content"]
  if (Array.isArray(media) && media[0]?.["@_url"]) return extractText(media[0]["@_url"])
  if (media?.["@_url"]) return extractText(media["@_url"])
  const thumb = item?.["media:thumbnail"]
  if (Array.isArray(thumb) && thumb[0]?.["@_url"]) return extractText(thumb[0]["@_url"])
  if (thumb?.["@_url"]) return extractText(thumb["@_url"])

  const rawDesc = extractText(item?.["content:encoded"] || item?.description, "")
  const imgMatch = rawDesc.match(/<img[^>]+src=["']([^"']+)["']/i)
  if (imgMatch?.[1]) return imgMatch[1]

  return CATEGORY_FALLBACK_IMAGES[catSlug] || CATEGORY_FALLBACK_IMAGES.blog
}

const makeSlug = (title) =>
  extractText(title, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 90) || `story-${Date.now()}`

let lastSyncAt = 0
let syncInFlight = null

export const syncEntertainmentNews = async ({ force = false } = {}) => {
  const THIRTY_MINUTES = 30 * 60 * 1000
  if (!force && Date.now() - lastSyncAt < THIRTY_MINUTES) {
    return { skipped: true, inserted: 0 }
  }
  if (syncInFlight) return syncInFlight

  syncInFlight = (async () => {
    let inserted = 0
    for (const source of RSS_SOURCES) {
      try {
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), 8000)
        const res = await fetch(source.url, {
          headers: { "User-Agent": "TellyShineEntertainment/1.0" },
          signal: controller.signal,
        })
        clearTimeout(timer)
        if (!res.ok) continue

        const xml = await res.text()
        const parsed = parser.parse(xml)
        const rawItems = parsed?.rss?.channel?.item || parsed?.feed?.entry || []
        const items = (Array.isArray(rawItems) ? rawItems : [rawItems])
          .filter((entry) => entry && typeof entry === "object")
          .slice(0, source.limit)

        const cat = normalizeCategory(source.category)

        for (let idx = 0; idx < items.length; idx++) {
          try {
            const item = items[idx]
            const title = stripHtml(item?.title)
            if (!title) continue

            const slug = makeSlug(title)
            const sourceUrl = extractText(item?.link, "")

            const exists = await Post.findOne({
              $or: [{ slug }, ...(sourceUrl ? [{ source_url: sourceUrl }] : [])],
            }).select("_id")

            if (exists) continue

            const rawSummary = stripHtml(item?.description || item?.summary || "")
            const summary =
              rawSummary.length > 260
                ? `${rawSummary.slice(0, 257)}...`
                : rawSummary || title

            const rawHtml = extractText(item?.["content:encoded"] || item?.content, "")
            const fullHtml =
              rawHtml ||
              `<p>${summary}</p>${
                sourceUrl
                  ? `<p><a href="${sourceUrl}" target="_blank" rel="noopener noreferrer">Read original coverage</a></p>`
                  : ""
              }`

            const imageUrl = extractImage(item, cat.slug)
            const rawDate = extractText(item?.pubDate || item?.published || item?.updated, "")
            const pubDate = rawDate ? new Date(rawDate) : new Date()
            const isoDate = Number.isNaN(pubDate.getTime())
              ? new Date().toISOString()
              : pubDate.toISOString()

            const authorName = extractText(
              item?.["dc:creator"] ?? item?.author?.name ?? item?.author,
              "Telly Shine News Desk"
            )

            await Post.create({
              article_id: crypto.randomUUID().replace(/-/g, ""),
              userId: "telly-shine-news-sync",
              title,
              slug,
              description: summary,
              excerpt: summary,
              content: fullHtml,
              category: cat.name,
              category_slug: cat.slug,
              category_name: cat.name,
              image: imageUrl,
              featured_image: imageUrl,
              status: "published",
              is_featured: Boolean(source.markFeatured && idx === 0),
              is_trending: Boolean(source.markTrending && idx < 2),
              is_breaking: Boolean(source.markBreaking && idx < 2),
              published_at: isoDate,
              source_url: sourceUrl,
              author: { name: authorName },
              tags: [cat.name, "Entertainment", "News"],
            })
            inserted++
          } catch (itemErr) {
            console.warn(`Skipped malformed RSS item from ${source.url}:`, itemErr.message)
          }
        }
      } catch (err) {
        console.warn(`RSS sync skipped for ${source.url}:`, err.message)
      }
    }

    lastSyncAt = Date.now()
    return { skipped: false, inserted }
  })().finally(() => {
    syncInFlight = null
  })

  return syncInFlight
}
