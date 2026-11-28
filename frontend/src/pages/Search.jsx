import PostCard from "@/components/shared/PostCard"
import { Button } from "@/components/ui/button"
import { normalizeArticles } from "@/lib/rssNormalize"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  PageTransition,
  StaggerGrid,
  StaggerItem,
} from "@/components/editorial/MotionPrimitives"
import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { SlidersHorizontal } from "lucide-react"

const Search = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "",
  })

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [showMore, setShowMore] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)

    const searchTermFromUrl = urlParams.get("searchTerm")
    const sortFromUrl = urlParams.get("sort")
    const categoryFromUrl = urlParams.get("category")

    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData((prev) => ({
        ...prev,
        searchTerm: searchTermFromUrl || "",
        sort: sortFromUrl || "desc",
        category: categoryFromUrl || "",
      }))
    }

    const fetchPosts = async () => {
      setLoading(true)
      const searchQuery = urlParams.toString()
      const res = await fetch(`/api/post/getposts?${searchQuery}`)

      if (!res.ok) {
        setLoading(false)
        return
      }

      const data = await res.json()
      const normalized = normalizeArticles(data.posts || [])
      setPosts(normalized)
      setLoading(false)
      setShowMore(normalized.length === 9)
    }

    fetchPosts()
  }, [location.search])

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams(location.search)
    urlParams.set("searchTerm", sidebarData.searchTerm)
    urlParams.set("sort", sidebarData.sort)
    urlParams.set("category", sidebarData.category)
    navigate(`/search?${urlParams.toString()}`)
  }

  const handleShowMore = async () => {
    const urlParams = new URLSearchParams(location.search)
    urlParams.set("startIndex", posts.length)
    const res = await fetch(`/api/post/getposts?${urlParams.toString()}`)
    if (!res.ok) return
    const data = await res.json()
    const next = normalizeArticles(data.posts || [])
    setPosts([...posts, ...next])
    setShowMore(next.length === 9)
  }

  return (
    <PageTransition>
      <main className="min-h-screen bg-ivory">
        <section className="bg-charcoal text-ivory border-b border-soft-black py-10 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
              Editorial Archive
            </p>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mt-1">
              Explore Stories &amp; Dispatches
            </h1>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-3">
            <form
              className="bg-ivory-light border border-stone rounded-sm p-6 space-y-5 sticky top-20"
              onSubmit={handleSubmit}
            >
              <div className="flex items-center gap-2 pb-3 border-b border-stone">
                <SlidersHorizontal className="w-4 h-4 text-burgundy" />
                <h2 className="font-serif text-lg font-bold text-charcoal">
                  Refine Search
                </h2>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  Keyword
                </label>
                <Input
                  placeholder="Search headlines, stars..."
                  id="searchTerm"
                  type="text"
                  className="bg-ivory border-stone rounded-sm text-charcoal focus-visible:ring-burgundy"
                  value={sidebarData.searchTerm}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  Sort By
                </label>
                <Select
                  onValueChange={(value) =>
                    setSidebarData({ ...sidebarData, sort: value })
                  }
                  value={sidebarData.sort}
                >
                  <SelectTrigger className="w-full bg-ivory border-stone rounded-sm text-charcoal">
                    <SelectValue placeholder="Select Order" />
                  </SelectTrigger>
                  <SelectContent className="bg-ivory-light border-stone">
                    <SelectGroup>
                      <SelectLabel>Order by</SelectLabel>
                      <SelectItem value="desc">Latest First</SelectItem>
                      <SelectItem value="asc">Oldest First</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  Section
                </label>
                <Select
                  onValueChange={(value) =>
                    setSidebarData({ ...sidebarData, category: value })
                  }
                  value={sidebarData.category}
                >
                  <SelectTrigger className="w-full bg-ivory border-stone rounded-sm text-charcoal">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="bg-ivory-light border-stone">
                    <SelectGroup>
                      <SelectLabel>Category</SelectLabel>
                      <SelectItem value="bollywood">Bollywood</SelectItem>
                      <SelectItem value="hollywood">Hollywood</SelectItem>
                      <SelectItem value="television">TV &amp; Television</SelectItem>
                      <SelectItem value="digital">Digital</SelectItem>
                      <SelectItem value="movies">Movies</SelectItem>
                      <SelectItem value="celebrity">Celebrity News</SelectItem>
                      <SelectItem value="stories">Stories</SelectItem>
                      <SelectItem value="blog">Blog</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-burgundy hover:bg-burgundy-dark text-ivory rounded-sm text-xs uppercase tracking-wider font-semibold h-10"
              >
                Apply Filters
              </Button>
            </form>
          </aside>

          {/* Results */}
          <div className="lg:col-span-9">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-80 rounded-sm bg-stone/40 animate-pulse border border-stone"
                  />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="rounded-sm border border-dashed border-stone bg-ivory-light p-12 text-center text-ink-muted text-sm">
                No articles matched your search criteria.
              </div>
            ) : (
              <>
                <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <StaggerItem key={post._id}>
                      <PostCard post={post} />
                    </StaggerItem>
                  ))}
                </StaggerGrid>

                {showMore && (
                  <div className="mt-10 text-center">
                    <Button
                      variant="outline"
                      onClick={handleShowMore}
                      className="border-charcoal text-charcoal hover:bg-charcoal hover:text-ivory rounded-sm text-xs uppercase tracking-wider font-semibold px-7 h-10"
                    >
                      Load More
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </PageTransition>
  )
}

export default Search
