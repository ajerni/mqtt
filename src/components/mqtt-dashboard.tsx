"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MQTTSubscriptions } from "@/components/mqtt-subscriptions"
import { MQTTPublish } from "@/components/mqtt-publish"
import { MQTTService } from "@/lib/mqtt"

type Message = {
  topic: string
  payload: string
  timestamp: Date
}

export function MQTTDashboard() {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [subscriptions, setSubscriptions] = useState<string[]>([])

  useEffect(() => {
    const mqttService = MQTTService.getInstance()
    
    const connect = async () => {
      try {
        const client = await mqttService.connect()
        setIsConnected(true)
        setError(null)

        // Set up message handler
        mqttService.onMessage((topic, message) => {
          console.log('Message received in dashboard:', { topic, message: message.toString() })
          setMessages((prev) => [{
            topic,
            payload: message.toString(),
            timestamp: new Date(),
          }, ...prev].slice(0, 50)) // Keep last 50 messages
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
  }, []) // Remove subscriptions dependency to avoid reconnecting

  const handleSubscribe = (topic: string, qos: 0 | 1 | 2) => {
    const mqttService = MQTTService.getInstance()
    try {
      mqttService.subscribe(topic, qos)
      setSubscriptions((prev) => [...new Set([...prev, topic])])
      console.log('Subscribed to:', topic)
    } catch (err) {
      console.error('Subscribe error:', err)
      setError(err instanceof Error ? err.message : 'Failed to subscribe')
    }
  }

  const handleUnsubscribe = (topic: string) => {
    const mqttService = MQTTService.getInstance()
    mqttService.unsubscribe(topic)
    setSubscriptions((prev) => prev.filter((t) => t !== topic))
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          MQTT Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="subscribe" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="subscribe">Subscribe</TabsTrigger>
            <TabsTrigger value="publish">Publish</TabsTrigger>
          </TabsList>
          <TabsContent value="subscribe">
            <MQTTSubscriptions 
              subscriptions={subscriptions}
              messages={messages}
              onSubscribe={handleSubscribe}
              onUnsubscribe={handleUnsubscribe}
            />
          </TabsContent>
          <TabsContent value="publish">
            <MQTTPublish />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 