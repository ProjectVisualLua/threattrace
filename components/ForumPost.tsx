"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, ThumbsUp, AlertTriangle, Clock, User, Eye } from "lucide-react"

interface ForumPostProps {
  id: string
  title: string
  content: string
  author: string
  timestamp: string
  category: "scam-alert" | "general" | "help" | "report"
  likes: number
  replies: number
  views: number
  isLiked?: boolean
  onLike?: (id: string) => void
  onReply?: (id: string) => void
  onView?: () => void
}

export function ForumPost({
  id,
  title,
  content,
  author,
  timestamp,
  category,
  likes,
  replies,
  views,
  isLiked = false,
  onLike,
  onReply,
  onView,
}: ForumPostProps) {
  const [hasViewed, setHasViewed] = useState(false)

  const handleLike = () => {
    onLike?.(id)
  }

  useEffect(() => {
    if (!hasViewed && onView) {
      onView()
      setHasViewed(true)
    }
  }, [hasViewed, onView])

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "scam-alert":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      case "help":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "report":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      default:
        return "bg-purple-500/20 text-purple-300 border-purple-500/30"
    }
  }

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "scam-alert":
        return <AlertTriangle className="w-4 h-4" />
      case "help":
        return <MessageSquare className="w-4 h-4" />
      case "report":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <MessageSquare className="w-4 h-4" />
    }
  }

  return (
    <Card className="bg-slate-800/50 border-cyan-500/20 p-6 hover:border-cyan-500/40 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Badge className={getCategoryColor(category)}>
            {getCategoryIcon(category)}
            <span className="ml-1 capitalize">{category.replace("-", " ")}</span>
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock className="w-4 h-4" />
          {timestamp}
        </div>
      </div>

      <h3 className="text-xl font-semibold text-white mb-3 hover:text-cyan-400 cursor-pointer transition-colors">
        {title}
      </h3>

      <p className="text-gray-300 mb-4 line-clamp-3">{content}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="text-cyan-400">{author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{views} views</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`flex items-center gap-2 transition-colors ${
              isLiked ? "text-blue-400 hover:text-blue-300" : "text-gray-400 hover:text-white"
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            {likes}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReply?.(id)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            {replies}
          </Button>
        </div>
      </div>
    </Card>
  )
}
