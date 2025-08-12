"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Code, Search, Heart, Zap, Users } from "lucide-react"

export default function AboutUs() {
  return (
    <div className="min-h-screen text-white relative z-10 py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-blue-500/20 text-blue-300 border-blue-500/30">
            <Shield className="w-4 h-4 mr-2" />
            About ThreatTrace
          </Badge>
          <h1 className="text-5xl md:text-6xl font-mono font-bold mb-6 glow-text">
            WHO WE <span className="text-blue-400">ARE</span>
          </h1>
        </div>

        {/* Main Content */}
        <Card className="bg-slate-800/50 border-blue-500/20 p-8 mb-12 cyber-border">
          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              At <span className="text-blue-400 font-semibold">ThreatTrace</span>, we are passionate cybersecurity
              enthusiasts dedicated to protecting our community from the ever-evolving landscape of online threats. Our
              mission is simple yet powerful: to expose scammers, educate users, and create a safer digital environment
              for everyone.
            </p>

            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              We specialize in identifying and exposing fake scripts, malicious software, and sophisticated phishing
              attempts that prey on unsuspecting users. Our team works tirelessly to analyze suspicious code, scan for
              malware, and provide comprehensive security assessments for links and downloads that could compromise your
              safety.
            </p>

            <p className="text-lg text-gray-300 leading-relaxed">
              Beyond detection, we believe in empowerment through education. We help community members understand code
              vulnerabilities, provide script analysis, and offer guidance on secure coding practices. Our love for this
              work stems from seeing the positive impact we make - every scam we expose and every person we help stay
              safe fuels our dedication to this cause.
            </p>
          </div>
        </Card>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="bg-slate-800/50 border-red-500/20 p-6 hover:border-red-500/40 transition-colors">
            <Shield className="w-12 h-12 text-red-400 mb-4" />
            <h3 className="text-xl font-semibold mb-3 text-red-300">Community Protection</h3>
            <p className="text-gray-300 text-sm">
              Safeguarding our members through proactive threat monitoring and rapid response to emerging scams.
            </p>
          </Card>

          <Card className="bg-slate-800/50 border-orange-500/20 p-6 hover:border-orange-500/40 transition-colors">
            <Code className="w-12 h-12 text-orange-400 mb-4" />
            <h3 className="text-xl font-semibold mb-3 text-orange-300">Script Analysis</h3>
            <p className="text-gray-300 text-sm">
              Exposing fake and malicious scripts through detailed code review and vulnerability assessment.
            </p>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/20 p-6 hover:border-purple-500/40 transition-colors">
            <Search className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold mb-3 text-purple-300">Malware Detection</h3>
            <p className="text-gray-300 text-sm">
              Advanced scanning and analysis of suspicious files, links, and downloads for hidden threats.
            </p>
          </Card>

          <Card className="bg-slate-800/50 border-blue-500/20 p-6 hover:border-blue-500/40 transition-colors">
            <Zap className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold mb-3 text-blue-300">Code Assistance</h3>
            <p className="text-gray-300 text-sm">
              Helping developers write secure code and identify potential vulnerabilities in their projects.
            </p>
          </Card>

          <Card className="bg-slate-800/50 border-green-500/20 p-6 hover:border-green-500/40 transition-colors">
            <Users className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold mb-3 text-green-300">Phishing Prevention</h3>
            <p className="text-gray-300 text-sm">
              Comprehensive link scanning and phishing detection to protect against fraudulent websites.
            </p>
          </Card>

          <Card className="bg-slate-800/50 border-pink-500/20 p-6 hover:border-pink-500/40 transition-colors">
            <Heart className="w-12 h-12 text-pink-400 mb-4" />
            <h3 className="text-xl font-semibold mb-3 text-pink-300">Passionate Mission</h3>
            <p className="text-gray-300 text-sm">
              Driven by genuine care for our community's safety and the satisfaction of exposing scammers.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
