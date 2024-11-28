"use client"

import { MQTTDashboard } from "@/components/mqtt-dashboard"
import { LoginForm } from "@/components/login-form"
import { useAuth } from "@/contexts/auth-context"

export default function Home() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <LoginForm />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">MQTT Dashboard</h1>
      <MQTTDashboard />
    </div>
  )
} 