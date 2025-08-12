"use client"

import { useState, useEffect } from "react"
import { Shield, Users, ExternalLink, Eye, Lock, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AnimatedBackground from "@/components/AnimatedBackground"
import Forum from "@/components/Forum"
import AboutUs from "@/components/AboutUs"
import { AuthProvider } from "@/components/AuthContext"

export default function Home() {
  const [isEntering, setIsEntering] = useState(false)
  const [showMainSite, setShowMainSite] = useState(false)
  const [scanComplete, setScanComplete] = useState(false)
  const [currentView, setCurrentView] = useState<"home" | "forum" | "about">("home")

  useEffect(() => {
    const timer = setTimeout(() => {
      setScanComplete(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleEnterSite = () => {
    setIsEntering(true)
    setTimeout(() => {
      setShowMainSite(true)
    }, 1500)
  }

  if (!scanComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        <AnimatedBackground />
        <div className="text-center z-10">
          <div className="mb-8">
            <img
              src="/images/threattrace-logo.png"
              alt="ThreatTrace Logo"
              className="w-32 h-32 mx-auto mb-4 glow-logo"
            />
          </div>
          <div className="scan-line mb-6"></div>
          <h1 className="text-4xl font-bold text-cyan-400 mb-4 glow-text">SECURITY SCAN IN PROGRESS</h1>
          <div className="flex items-center justify-center space-x-2 text-green-400">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-mono">Analyzing threat vectors...</span>
          </div>
          <div className="mt-8 w-64 h-2 bg-slate-700 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-green-500 rounded-full animate-pulse scan-progress"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!showMainSite) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        <AnimatedBackground />
        <div className="text-center z-10">
          <div className="mb-8">
            <img
              src="/images/threattrace-logo.png"
              alt="ThreatTrace Logo"
              className="w-40 h-40 mx-auto mb-6 glow-logo"
            />
          </div>
          <div className="cyber-border p-8 max-w-md mx-auto">
            <h1 className="text-5xl font-bold text-cyan-400 mb-4 glow-text font-orbitron">THREATTRACE</h1>
            <p className="text-xl text-slate-300 mb-6">ANTI-SCAM SECURITY PLATFORM</p>
            <div className="flex items-center justify-center space-x-2 text-green-400 mb-6">
              <CheckCircle className="w-5 h-5" />
              <span className="font-mono">SYSTEM SECURE</span>
            </div>
            <Button
              onClick={handleEnterSite}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 glow-button"
              disabled={isEntering}
            >
              {isEntering ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>ACCESSING...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>ENTER SECURE ZONE</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        <AnimatedBackground />

        {/* Navigation */}
        <nav className="relative z-50 p-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="/images/threattrace-logo.png" alt="ThreatTrace Logo" className="w-12 h-12 glow-logo" />
              <h1 className="text-2xl font-bold text-cyan-400 glow-text font-orbitron">ThreatTrace</h1>
            </div>

            <div className="flex items-center space-x-6">
              <button
                onClick={() => setCurrentView("home")}
                className="text-slate-300 hover:text-cyan-400 transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => setCurrentView("forum")}
                className="text-slate-300 hover:text-cyan-400 transition-colors"
              >
                Forum
              </button>
              <button
                onClick={() => setCurrentView("about")}
                className="text-slate-300 hover:text-cyan-400 transition-colors"
              >
                About us
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="relative z-10">
          {currentView === "forum" && <Forum />}
          {currentView === "about" && <AboutUs onNavigateToForum={() => setCurrentView("forum")} />}
          {currentView === "home" && (
            <>
              {/* Hero Section */}
              <section className="px-6 py-20">
                <div className="max-w-4xl mx-auto text-center">
                  <h1 className="text-6xl font-bold text-white mb-6 glow-text font-orbitron">
                    DEFEND AGAINST
                    <span className="text-cyan-400"> DIGITAL THREATS</span>
                  </h1>
                  <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                    Advanced anti-scam protection powered by community intelligence. Detect, analyze, and neutralize
                    threats before they strike.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                    <Button
                      onClick={() => setCurrentView("forum")}
                      className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 glow-button"
                    >
                      <Shield className="w-5 h-5 mr-2" />
                      Start Protection
                    </Button>
                    <Button
                      onClick={() => window.open("https://discord.gg/nKPbKbEYu8", "_blank")}
                      className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 glow-button"
                    >
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Join our Discord!
                    </Button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                    <div className="cyber-border p-6">
                      <div className="text-3xl font-bold text-cyan-400 mb-2">1000+</div>
                      <div className="text-slate-300">Threats Blocked</div>
                    </div>
                    <div className="cyber-border p-6">
                      <div className="text-3xl font-bold text-green-400 mb-2">100+</div>
                      <div className="text-slate-300">Community Members</div>
                    </div>
                    <div className="cyber-border p-6">
                      <div className="text-3xl font-bold text-yellow-400 mb-2">99.9%</div>
                      <div className="text-slate-300">Detection Rate</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Features */}
              <section className="px-6 py-20">
                <div className="max-w-6xl mx-auto">
                  <h2 className="text-4xl font-bold text-center text-white mb-12 glow-text font-orbitron">
                    SECURITY FEATURES
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Card className="bg-slate-800/50 border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300 cyber-border">
                      <CardHeader>
                        <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
                          <Shield className="w-6 h-6 text-cyan-400" />
                        </div>
                        <CardTitle className="text-cyan-400">Threat Detection</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-slate-300">
                          Advanced AI-powered scanning to identify and neutralize malicious scripts, phishing attempts,
                          and scam operations.
                        </CardDescription>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-green-500/30 hover:border-green-400/50 transition-all duration-300 cyber-border">
                      <CardHeader>
                        <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                          <Users className="w-6 h-6 text-green-400" />
                        </div>
                        <CardTitle className="text-green-400">Community Forum</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-slate-300">
                          Connect with security experts and share experiences. Learn from real-world threat encounters
                          and prevention strategies.
                        </CardDescription>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 cyber-border">
                      <CardHeader>
                        <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                          <Eye className="w-6 h-6 text-purple-400" />
                        </div>
                        <CardTitle className="text-purple-400">Real-time Monitoring</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-slate-300">
                          24/7 surveillance of emerging threats with instant alerts and automated response protocols for
                          maximum protection.
                        </CardDescription>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300 cyber-border">
                      <CardHeader>
                        <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4">
                          <Lock className="w-6 h-6 text-yellow-400" />
                        </div>
                        <CardTitle className="text-yellow-400">Secure Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-slate-300">
                          Safe environment for analyzing suspicious code and links without compromising your system's
                          security.
                        </CardDescription>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-red-500/30 hover:border-red-400/50 transition-all duration-300 cyber-border">
                      <CardHeader>
                        <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
                          <AlertTriangle className="w-6 h-6 text-red-400" />
                        </div>
                        <CardTitle className="text-red-400">Incident Response</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-slate-300">
                          Rapid response team for security incidents with detailed forensics and recovery assistance.
                        </CardDescription>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 cyber-border">
                      <CardHeader>
                        <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                          <TrendingUp className="w-6 h-6 text-blue-400" />
                        </div>
                        <CardTitle className="text-blue-400">Threat Intelligence</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-slate-300">
                          Access to global threat intelligence feeds and predictive analytics for proactive security
                          measures.
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </AuthProvider>
  )
}
