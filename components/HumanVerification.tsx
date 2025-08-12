"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, RefreshCw, CheckCircle, AlertCircle } from "lucide-react"

interface HumanVerificationProps {
  onVerified: () => void
  onCancel?: () => void
  title?: string
  description?: string
}

export function HumanVerification({
  onVerified,
  onCancel,
  title = "Human Verification Required",
  description = "Complete the security challenge to continue",
}: HumanVerificationProps) {
  const [challenge, setChallenge] = useState({ question: "", answer: "" })
  const [userAnswer, setUserAnswer] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState("")
  const [attempts, setAttempts] = useState(0)
  const [isVerified, setIsVerified] = useState(false)

  const generateChallenge = () => {
    const challenges = [
      {
        question: "What is 7 + 15?",
        answer: "22",
      },
      {
        question: "How many letters are in 'SECURITY'?",
        answer: "8",
      },
      {
        question: "What is 3 × 4?",
        answer: "12",
      },
      {
        question: "Complete: THREAT____",
        answer: "TRACE",
      },
      {
        question: "What comes after Tuesday?",
        answer: "WEDNESDAY",
      },
      {
        question: "What is 25 - 8?",
        answer: "17",
      },
      {
        question: "How many sides does a triangle have?",
        answer: "3",
      },
      {
        question: "What color do you get mixing blue and yellow?",
        answer: "GREEN",
      },
    ]

    const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)]
    setChallenge(randomChallenge)
    setUserAnswer("")
    setError("")
  }

  useEffect(() => {
    generateChallenge()
  }, [])

  const handleVerify = async () => {
    setIsVerifying(true)
    setError("")

    // Simulate verification delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const isCorrect = userAnswer.toLowerCase().trim() === challenge.answer.toLowerCase()

    if (isCorrect) {
      setIsVerified(true)
      setTimeout(() => {
        onVerified()
      }, 1000)
    } else {
      setAttempts(attempts + 1)
      setError("Incorrect answer. Please try again.")

      if (attempts >= 2) {
        generateChallenge()
        setAttempts(0)
      }
    }

    setIsVerifying(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isVerifying && userAnswer.trim()) {
      handleVerify()
    }
  }

  if (isVerified) {
    return (
      <Card className="bg-slate-800/50 border-green-500/30 p-8 max-w-md mx-auto">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-400 mb-2">Verification Complete</h3>
          <p className="text-gray-300">Human identity confirmed. Access granted.</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800/50 border-cyan-500/30 p-8 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <Shield className="w-12 h-12 text-cyan-400" />
        </div>
        <h3 className="text-xl font-semibold text-cyan-400 mb-2">{title}</h3>
        <p className="text-gray-300 text-sm">{description}</p>
      </div>

      <div className="space-y-4">
        {/* Challenge Display */}
        <div className="bg-black/50 border border-cyan-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-cyan-400 font-mono">Security Challenge</Label>
            <Button variant="ghost" size="sm" onClick={generateChallenge} className="text-gray-400 hover:text-white">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-white font-mono text-lg text-center py-2">{challenge.question}</div>
        </div>

        {/* Answer Input */}
        <div>
          <Label htmlFor="answer" className="text-cyan-400">
            Your Answer
          </Label>
          <Input
            id="answer"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            className="bg-black/50 border-cyan-500/50 text-white focus:border-cyan-400 text-center font-mono"
            placeholder="Enter your answer"
            disabled={isVerifying}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Attempt Counter */}
        <div className="text-center text-sm text-gray-400">
          Attempt {attempts + 1} of 3 {attempts >= 2 && "(New challenge generated)"}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleVerify}
            disabled={!userAnswer.trim() || isVerifying}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
          >
            {isVerifying ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Verifying...
              </>
            ) : (
              "Verify"
            )}
          </Button>
          {onCancel && (
            <Button variant="outline" onClick={onCancel} className="border-gray-500 bg-transparent">
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Security Info */}
      <div className="mt-6 text-xs text-gray-500 text-center">
        <Shield className="w-3 h-3 inline mr-1" />
        This verification helps protect against automated threats
      </div>
    </Card>
  )
}
