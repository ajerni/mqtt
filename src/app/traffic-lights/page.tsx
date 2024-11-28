"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrafficLight } from "@/components/traffic-light"
import { MQTTService } from "@/lib/mqtt"
import { LoginForm } from "@/components/login-form"
import { useAuth } from "@/contexts/auth-context"

type LightState = "idle" | "red" | "yellow" | "green"

export default function TrafficLightsPage() {
  const { isAuthenticated } = useAuth()
  const [lightState, setLightState] = useState<LightState>("idle")
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <LoginForm />
      </div>
    )
  }

  useEffect(() => {
    const mqttService = MQTTService.getInstance()
    
    const connect = async () => {
      try {
        await mqttService.connect()
        setIsConnected(true)
        setError(null)

        // Subscribe to traffic light topics
        mqttService.subscribe("ampel/#")

        // Set up message handler
        mqttService.onMessage((topic, message) => {
          console.log('Traffic light message received:', { topic, message: message.toString() })
          
          switch (topic) {
            case "ampel/grün":
              setLightState("green")
              break
            case "ampel/gelb":
              setLightState("yellow")
              break
            case "ampel/rot":
              setLightState("red")
              break
            default:
              console.log('Unknown topic:', topic)
          }
        })
      } catch (err) {
        console.error('Connection error:', err)
        setError(err instanceof Error ? err.message : 'Failed to connect to MQTT broker')
        setIsConnected(false)
      }
    }

    connect()

    return () => {
      console.log('Cleaning up MQTT connection')
      mqttService.disconnect()
    }
  }, [])

  if (error) {
    return (
      <Card className="bg-destructive/10">
        <CardContent className="p-6">
          <p className="text-destructive">Error: {error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <h1 className="text-4xl font-bold">Traffic Lights</h1>
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
      </div>
      
      <div className="flex flex-col items-center space-y-8">
        <TrafficLight currentState={lightState} />
        
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              Listening for messages on topic: <code className="bg-muted px-1 py-0.5 rounded">ampel/#</code>
            </p>
            <ul className="mt-2 text-sm">
              <li><code className="bg-muted px-1 py-0.5 rounded">ampel/grün</code> - Turn green light on</li>
              <li><code className="bg-muted px-1 py-0.5 rounded">ampel/gelb</code> - Turn yellow light on</li>
              <li><code className="bg-muted px-1 py-0.5 rounded">ampel/rot</code> - Turn red light on</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 