"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, X, AlertTriangle, MessageSquare, Users } from "lucide-react"

interface DiscordNotification {
  id: string
  type: "alert" | "message" | "member"
  title: string
  content: string
  timestamp: string
  channel: string
}

export default function DiscordNotifications() {
  const [notifications, setNotifications] = useState<DiscordNotification[]>([
    {
      id: "1",
      type: "alert",
      title: "New Scam Alert",
      content: "CryptoGuardian reported a new phishing campaign targeting crypto wallets",
      timestamp: "2 min ago",
      channel: "#scam-alerts",
    },
    {
      id: "2",
      type: "message",
      title: "Help Request",
      content: "NewbieSafe is asking about email verification best practices",
      timestamp: "5 min ago",
      channel: "#help-support",
    },
    {
      id: "3",
      type: "member",
      title: "New Member",
      content: "SecurityExpert joined the server",
      timestamp: "8 min ago",
      channel: "#general",
    },
  ])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show notifications after a delay
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const removeNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="w-4 h-4 text-red-400" />
      case "message":
        return <MessageSquare className="w-4 h-4 text-blue-400" />
      case "member":
        return <Users className="w-4 h-4 text-green-400" />
      default:
        return <Bell className="w-4 h-4 text-gray-400" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "alert":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      case "message":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "member":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  if (!isVisible || notifications.length === 0) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <Card
          key={notification.id}
          className="bg-slate-900/95 backdrop-blur-sm border-purple-500/30 p-4 animate-in slide-in-from-right duration-300"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              {getIcon(notification.type)}
              <Badge className={getTypeColor(notification.type)} variant="outline">
                Discord
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeNotification(notification.id)}
              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>

          <h4 className="text-sm font-semibold text-white mb-1">{notification.title}</h4>
          <p className="text-xs text-gray-300 mb-2">{notification.content}</p>

          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{notification.channel}</span>
            <span>{notification.timestamp}</span>
          </div>
        </Card>
      ))}
    </div>
  )
}
