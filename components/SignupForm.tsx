"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "./AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HumanVerification } from "./HumanVerification"

interface SignupFormProps {
  onSuccess: () => void
  onSwitchToLogin: () => void
}

export function SignupForm({ onSuccess, onSwitchToLogin }: SignupFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [showVerification, setShowVerification] = useState(false)
  const [formData, setFormData] = useState<{ email: string; password: string; username: string } | null>(null)
  const { signup, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password || !username || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setFormData({ email, password, username })
    setShowVerification(true)
  }

  const handleVerificationComplete = async () => {
    if (!formData) return

    const success = await signup(formData.email, formData.password, formData.username)
    if (success) {
      onSuccess()
    } else {
      setError("Failed to create account")
      setShowVerification(false)
    }
  }

  if (showVerification) {
    return (
      <div className="w-full max-w-md mx-auto">
        <HumanVerification
          onVerified={handleVerificationComplete}
          onCancel={() => setShowVerification(false)}
          title="Complete Registration"
          description="Verify you're human to create your ThreatTrace account"
        />
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-cyan-400 mb-2">Join ThreatTrace</h2>
          <p className="text-gray-300">Create your secure account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username" className="text-cyan-400">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-black/50 border-cyan-500/50 text-white focus:border-cyan-400"
              placeholder="Choose a username"
            />
          </div>

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
              placeholder="Create a password"
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-cyan-400">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-black/50 border-cyan-500/50 text-white focus:border-cyan-400"
              placeholder="Confirm your password"
            />
          </div>

          {error && <div className="text-red-400 text-sm text-center">{error}</div>}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold"
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>

        <div className="text-center mt-6">
          <button onClick={onSwitchToLogin} className="text-cyan-400 hover:text-cyan-300 text-sm">
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  )
}
