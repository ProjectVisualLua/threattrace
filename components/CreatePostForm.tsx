"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"
import { HumanVerification } from "./HumanVerification"

interface CreatePostFormProps {
  onSubmit: (post: {
    title: string
    content: string
    category: string
  }) => void
  onCancel: () => void
}

export function CreatePostForm({ onSubmit, onCancel }: CreatePostFormProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [showVerification, setShowVerification] = useState(false)
  const [formData, setFormData] = useState<{ title: string; content: string; category: string } | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title && content && category) {
      setFormData({ title, content, category })
      setShowVerification(true)
    }
  }

  const handleVerificationComplete = () => {
    if (formData) {
      onSubmit(formData)
      setTitle("")
      setContent("")
      setCategory("")
      setShowVerification(false)
    }
  }

  if (showVerification) {
    return (
      <div className="max-w-md mx-auto">
        <HumanVerification
          onVerified={handleVerificationComplete}
          onCancel={() => setShowVerification(false)}
          title="Verify Post Submission"
          description="Complete verification to publish your post to the community"
        />
      </div>
    )
  }

  return (
    <Card className="bg-slate-800/50 border-cyan-500/30 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-cyan-400">Create New Post</h3>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="category" className="text-cyan-400">
            Category
          </Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="bg-black/50 border-cyan-500/50 text-white">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-cyan-500/50">
              <SelectItem value="scam-alert">Scam Alert</SelectItem>
              <SelectItem value="general">General Discussion</SelectItem>
              <SelectItem value="help">Help & Support</SelectItem>
              <SelectItem value="report">Report Threat</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="title" className="text-cyan-400">
            Title
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-black/50 border-cyan-500/50 text-white focus:border-cyan-400"
            placeholder="Enter post title"
          />
        </div>

        <div>
          <Label htmlFor="content" className="text-cyan-400">
            Content
          </Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="bg-black/50 border-cyan-500/50 text-white focus:border-cyan-400 min-h-32"
            placeholder="Share your experience, ask for help, or report a threat..."
          />
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
          >
            Post
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="border-gray-500 bg-transparent">
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}
