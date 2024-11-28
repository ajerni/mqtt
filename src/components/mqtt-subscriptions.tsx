"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Message = {
  topic: string
  payload: string
  timestamp: Date
}

interface MQTTSubscriptionsProps {
  subscriptions: string[]
  messages: Message[]
  onSubscribe: (topic: string, qos: 0 | 1 | 2) => void
  onUnsubscribe: (topic: string) => void
}

export function MQTTSubscriptions({ 
  subscriptions, 
  messages, 
  onSubscribe, 
  onUnsubscribe 
}: MQTTSubscriptionsProps) {
  const [topic, setTopic] = useState("")
  const [qos, setQos] = useState<"0" | "1" | "2">("0")

  const handleSubscribe = () => {
    if (!topic) return
    onSubscribe(topic, Number(qos) as 0 | 1 | 2)
    setTopic("") // Clear input after subscribing
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Enter topic (e.g., sensors/#)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <Select value={qos} onValueChange={(value) => setQos(value as "0" | "1" | "2")}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="QoS" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">QoS 0</SelectItem>
            <SelectItem value="1">QoS 1</SelectItem>
            <SelectItem value="2">QoS 2</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleSubscribe}>Subscribe</Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Active Subscriptions</h3>
            <ul className="space-y-2">
              {subscriptions.map((topic) => (
                <li key={topic} className="flex justify-between items-center">
                  <span>{topic}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onUnsubscribe(topic)}
                  >
                    Unsubscribe
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Messages</h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className="p-2 border rounded-lg text-sm"
                >
                  <div className="font-medium">{msg.topic}</div>
                  <div className="text-muted-foreground">{msg.payload}</div>
                  <div className="text-xs text-muted-foreground">
                    {msg.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 