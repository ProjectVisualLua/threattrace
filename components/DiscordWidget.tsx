"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, MessageCircle, Volume2, ExternalLink } from "lucide-react"

interface DiscordStatus {
  online: number
  members: number
  channels: number
}

export default function DiscordWidget() {
  const [discordStatus, setDiscordStatus] = useState<DiscordStatus>({
    online: 30,
    members: 100,
    channels: 20,
  })
  const [isConnected, setIsConnected] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setDiscordStatus((prev) => ({
        ...prev,
        online: Math.max(25, Math.min(35, prev.online + Math.floor(Math.random() * 6) - 3)),
      }))
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const handleJoinDiscord = () => {
    window.open("https://discord.gg/nKPbKbEYu8", "_blank")
  }

  return (
    <Card className="bg-slate-800/50 border-purple-500/20 p-6 hover:border-purple-500/40 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="w-8 h-8 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.077.077 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            {isConnected && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">ThreatTrace Discord</h3>
            <p className="text-sm text-gray-400">Community Hub</p>
          </div>
        </div>
        <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
          Online
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Users className="w-4 h-4 text-purple-400 mr-1" />
            <span className="text-lg font-bold text-white">{discordStatus.online.toLocaleString()}</span>
          </div>
          <p className="text-xs text-gray-400">Online</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <MessageCircle className="w-4 h-4 text-blue-400 mr-1" />
            <span className="text-lg font-bold text-white">100+</span>
          </div>
          <p className="text-xs text-gray-400">Members</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Volume2 className="w-4 h-4 text-cyan-400 mr-1" />
            <span className="text-lg font-bold text-white">{discordStatus.channels}</span>
          </div>
          <p className="text-xs text-gray-400">Channels</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">#general</span>
          <span className="text-green-400">Active</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">#scam-alerts</span>
          <span className="text-yellow-400">12 new</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">#help-support</span>
          <span className="text-blue-400">3 new</span>
        </div>
      </div>

      <Button
        onClick={handleJoinDiscord}
        className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        Join Discord Server
      </Button>
    </Card>
  )
}
