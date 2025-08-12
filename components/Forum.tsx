"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ForumPost } from "./ForumPost"
import { CreatePostForm } from "./CreatePostForm"
import { useAuth } from "./AuthContext"
import { LoginForm } from "./LoginForm"
import { SignupForm } from "./SignupForm"
import { Plus, Search, TrendingUp, ThumbsUp } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface Post {
  id: string
  title: string
  content: string
  author: string
  author_email: string
  timestamp: string
  category: "scam-alert" | "general" | "help" | "report"
  likes: number
  replies: number
  views: number
  likedBy: string[]
  repliesData: Reply[]
}

interface Reply {
  id: string
  content: string
  author: string
  author_email: string
  timestamp: string
  likes: number
  likedBy: string[]
}

function Forum() {
  const { user } = useAuth()
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [expandedPost, setExpandedPost] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPosts()

    // Set up real-time subscription for posts
    const postsSubscription = supabase
      .channel("forum_posts")
      .on("postgres_changes", { event: "*", schema: "public", table: "forum_posts" }, () => {
        loadPosts()
      })
      .subscribe()

    // Set up real-time subscription for replies
    const repliesSubscription = supabase
      .channel("forum_replies")
      .on("postgres_changes", { event: "*", schema: "public", table: "forum_replies" }, () => {
        loadPosts()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(postsSubscription)
      supabase.removeChannel(repliesSubscription)
    }
  }, [])

  const loadPosts = async () => {
    try {
      // Load posts
      const { data: postsData, error: postsError } = await supabase
        .from("forum_posts")
        .select("*")
        .order("created_at", { ascending: false })

      if (postsError) throw postsError

      // Load replies for each post
      const postsWithReplies = await Promise.all(
        (postsData || []).map(async (post) => {
          const { data: repliesData } = await supabase
            .from("forum_replies")
            .select("*")
            .eq("post_id", post.id)
            .order("created_at", { ascending: true })

          // Load likes for post
          const { data: postLikes } = await supabase.from("forum_likes").select("user_email").eq("post_id", post.id)

          // Load likes for replies
          const repliesWithLikes = await Promise.all(
            (repliesData || []).map(async (reply) => {
              const { data: replyLikes } = await supabase
                .from("forum_likes")
                .select("user_email")
                .eq("reply_id", reply.id)

              return {
                id: reply.id,
                content: reply.content,
                author: reply.author_username || reply.author_email,
                author_email: reply.author_email,
                timestamp: formatTimestamp(reply.created_at),
                likes: reply.likes,
                likedBy: (replyLikes || []).map((like) => like.user_email),
              }
            }),
          )

          return {
            id: post.id,
            title: post.title,
            content: post.content,
            author: post.author_username || post.author_email,
            author_email: post.author_email,
            timestamp: formatTimestamp(post.created_at),
            category: post.category,
            likes: post.likes,
            replies: post.replies,
            views: post.views,
            likedBy: (postLikes || []).map((like) => like.user_email),
            repliesData: repliesWithLikes,
          }
        }),
      )

      setPosts(postsWithReplies)
    } catch (error) {
      console.error("Error loading posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`
    return `${Math.floor(diffInMinutes / 1440)} days ago`
  }

  const handleLike = async (postId: string) => {
    if (!user) return

    try {
      // Check if user already liked this post
      const { data: existingLike } = await supabase
        .from("forum_likes")
        .select("id")
        .eq("post_id", postId)
        .eq("user_email", user.email)
        .single()

      if (existingLike) {
        // Unlike the post
        await supabase.from("forum_likes").delete().eq("post_id", postId).eq("user_email", user.email)

        await supabase.rpc("decrement_post_likes", { post_id: postId })
      } else {
        // Like the post
        await supabase.from("forum_likes").insert({ post_id: postId, user_email: user.email })

        await supabase.rpc("increment_post_likes", { post_id: postId })
      }

      // Reload posts to get updated counts
      loadPosts()
    } catch (error) {
      console.error("Error handling like:", error)
    }
  }

  const handleReply = (postId: string) => {
    setExpandedPost(expandedPost === postId ? null : postId)
  }

  const handleSubmitReply = async (postId: string) => {
    if (!user || !replyContent.trim()) return

    try {
      // Insert reply into database
      const { error } = await supabase.from("forum_replies").insert({
        post_id: postId,
        content: replyContent,
        author_email: user.email,
        author_username: user.username,
      })

      if (error) throw error

      // Update reply count
      await supabase
        .from("forum_posts")
        .update({ replies: posts.find((p) => p.id === postId)?.replies + 1 || 1 })
        .eq("id", postId)

      setReplyContent("")
      setExpandedPost(null)
      loadPosts() // Reload to show new reply
    } catch (error) {
      console.error("Error submitting reply:", error)
    }
  }

  const handleViewPost = async (postId: string) => {
    try {
      await supabase.rpc("increment_post_views", { post_id: postId })
      loadPosts() // Reload to show updated view count
    } catch (error) {
      console.error("Error tracking view:", error)
    }
  }

  const handleCreatePost = async (newPost: { title: string; content: string; category: string }) => {
    if (!user) return

    try {
      const { error } = await supabase.from("forum_posts").insert({
        title: newPost.title,
        content: newPost.content,
        category: newPost.category,
        author_email: user.email,
        author_username: user.username,
      })

      if (error) throw error

      setShowCreatePost(false)
      loadPosts() // Reload to show new post
    } catch (error) {
      console.error("Error creating post:", error)
    }
  }

  const handleAuthSuccess = () => {
    setShowAuth(false)
  }

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0)
  const totalViews = posts.reduce((sum, post) => sum + post.views, 0)
  const activeUsers = new Set(posts.map((post) => post.author)).size

  if (showAuth) {
    return (
      <div className="min-h-screen matrix-bg flex items-center justify-center p-4">
        {authMode === "login" ? (
          <LoginForm onSuccess={handleAuthSuccess} onSwitchToSignup={() => setAuthMode("signup")} />
        ) : (
          <SignupForm onSuccess={handleAuthSuccess} onSwitchToLogin={() => setAuthMode("login")} />
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen matrix-bg flex items-center justify-center">
        <div className="text-white text-xl">Loading forum...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen matrix-bg text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Forum Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-mono font-bold glow-text mb-2">Community Forum</h1>
              <p className="text-gray-300">Share knowledge, report threats, and stay protected together</p>
            </div>
            {user ? (
              <Button
                onClick={() => setShowCreatePost(true)}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            ) : (
              <Button
                onClick={() => setShowAuth(true)}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              >
                Login to Post
              </Button>
            )}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/50 border-cyan-500/50 text-white focus:border-cyan-400"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge
                variant={selectedCategory === "all" ? "default" : "outline"}
                className={`cursor-pointer ${
                  selectedCategory === "all" ? "bg-cyan-500" : "border-cyan-500/50 hover:border-cyan-400"
                }`}
                onClick={() => setSelectedCategory("all")}
              >
                All
              </Badge>
              <Badge
                variant={selectedCategory === "scam-alert" ? "default" : "outline"}
                className={`cursor-pointer ${
                  selectedCategory === "scam-alert" ? "bg-red-500" : "border-red-500/50 hover:border-red-400"
                }`}
                onClick={() => setSelectedCategory("scam-alert")}
              >
                Scam Alerts
              </Badge>
              <Badge
                variant={selectedCategory === "help" ? "default" : "outline"}
                className={`cursor-pointer ${
                  selectedCategory === "help" ? "bg-blue-500" : "border-blue-500/50 hover:border-blue-400"
                }`}
                onClick={() => setSelectedCategory("help")}
              >
                Help
              </Badge>
              <Badge
                variant={selectedCategory === "report" ? "default" : "outline"}
                className={`cursor-pointer ${
                  selectedCategory === "report" ? "bg-orange-500" : "border-orange-500/50 hover:border-orange-400"
                }`}
                onClick={() => setSelectedCategory("report")}
              >
                Reports
              </Badge>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 text-sm text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>{posts.length} Total Posts</span>
            </div>
            <div>Total Likes: {totalLikes}</div>
            <div>Total Views: {totalViews}</div>
            <div>Active Users: {activeUsers}</div>
          </div>
        </div>

        {/* Create Post Form */}
        {showCreatePost && (
          <div className="mb-8">
            <CreatePostForm onSubmit={handleCreatePost} onCancel={() => setShowCreatePost(false)} />
          </div>
        )}

        {/* Posts List */}
        <div className="space-y-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div key={post.id}>
                <ForumPost
                  {...post}
                  isLiked={user ? post.likedBy.includes(user.email) : false}
                  onLike={handleLike}
                  onReply={handleReply}
                  onView={() => handleViewPost(post.id)}
                />

                {expandedPost === post.id && (
                  <div className="mt-4 ml-8 space-y-4">
                    {/* Existing Replies */}
                    {post.repliesData.map((reply) => (
                      <div key={reply.id} className="bg-slate-700/30 border border-cyan-500/20 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-cyan-400 font-medium">{reply.author}</span>
                          <span className="text-gray-400 text-sm">{reply.timestamp}</span>
                        </div>
                        <p className="text-gray-300 mb-2">{reply.content}</p>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400 p-1">
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            {reply.likes}
                          </Button>
                        </div>
                      </div>
                    ))}

                    {/* Reply Form */}
                    {user && (
                      <div className="bg-slate-800/50 border border-cyan-500/30 rounded-lg p-4">
                        <textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Write your reply..."
                          className="w-full bg-black/50 border border-cyan-500/50 rounded p-3 text-white resize-none"
                          rows={3}
                        />
                        <div className="flex gap-2 mt-3">
                          <Button
                            onClick={() => handleSubmitReply(post.id)}
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                            disabled={!replyContent.trim()}
                          >
                            Reply
                          </Button>
                          <Button variant="outline" onClick={() => setExpandedPost(null)} className="border-gray-500">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No posts found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Forum
