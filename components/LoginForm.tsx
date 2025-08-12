"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "./AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LoginFormProps {
  onSuccess: () => void
  onSwitchToSignup: () => void
}

export function LoginForm({ onSuccess, onSwitchToSignup }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    const success = await login(email, password)
    if (success) {
      onSuccess()
    } else {
      setError("Invalid credentials")
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-cyan-400 mb-2">Access ThreatTrace</h2>
          <p className="text-gray-300">Secure your digital presence</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-cyan-400">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black/50 border-cyan-500/50 text-white focus:border-cyan-400"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-cyan-400">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-black/50 border-cyan-500/50 text-white focus:border-cyan-400"
              placeholder="Enter your password"
            />
          </div>

          {error && <div className="text-red-400 text-sm text-center">{error}</div>}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold"
          >
            {isLoading ? "Authenticating..." : "Login"}
          </Button>
        </form>

        <div className="text-center mt-6">
          <button onClick={onSwitchToSignup} className="text-cyan-400 hover:text-cyan-300 text-sm">
            Don't have an account? Sign up
          </button>
        </div>
      </div>
    </div>
  )
}
