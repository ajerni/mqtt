"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { MQTTService } from "@/lib/mqtt"
import { LoginForm } from "@/components/login-form"
import { useAuth } from "@/contexts/auth-context"

type AlertState = {
  isOk: boolean
  message: string
}

export default function AlertsPage() {
  const { isAuthenticated } = useAuth()
  const [alertState, setAlertState] = useState<AlertState>({ isOk: true, message: "" })
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) return

    const mqttService = MQTTService.getInstance()
    
    const connect = async () => {
      try {
        await mqttService.connect()
        setIsConnected(true)
        setError(null)

        // Subscribe to alert topics
        mqttService.subscribe("alert/#")

        // Set up message handler
        mqttService.onMessage((topic, message) => {
          console.log('Alert message received:', { topic, message: message.toString() })
          
          switch (topic) {
            case "alert/on":
              setAlertState({ isOk: false, message: message.toString() })
              break
            case "alert/off":
              setAlertState({ isOk: true, message: message.toString() })
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
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <LoginForm />
      </div>
    )
  }

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
        <h1 className="text-4xl font-bold">Alerts</h1>
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
      </div>
      
      <div className="flex flex-col items-center space-y-8">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 flex flex-col items-center space-y-4">
            <div
              className={`w-3/4 mx-auto py-12 text-center text-2xl font-bold rounded-lg ${
                alertState.isOk 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white animate-pulse'
              }`}
            >
              <span className="inline-block">
                {alertState.isOk ? 'OK' : 'Alert!'}
              </span>
            </div>
            
            <div className="w-3/4 p-4 bg-muted rounded-lg">
              <p className="text-center break-words">
                {alertState.message || 'No message received'}
              </p>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Listening for messages on topic: <code className="bg-muted px-1 py-0.5 rounded">alert/#</code></p>
              <ul className="mt-2 space-y-1">
                <li><code className="bg-muted px-1 py-0.5 rounded">alert/on</code> - Trigger alert</li>
                <li><code className="bg-muted px-1 py-0.5 rounded">alert/off</code> - Clear alert</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 