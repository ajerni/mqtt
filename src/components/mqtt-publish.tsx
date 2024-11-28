"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MQTTService } from "@/lib/mqtt"

export function MQTTPublish() {
  const [topic, setTopic] = useState("")
  const [message, setMessage] = useState("")
  const [qos, setQos] = useState<"0" | "1" | "2">("0")

  const handlePublish = () => {
    if (!topic || !message) return

    const mqttService = MQTTService.getInstance()
    mqttService.publish(topic, message, Number(qos) as 0 | 1 | 2)
    
    // Clear message after publishing
    setMessage("")
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Enter topic"
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
      </div>
      
      <Textarea
        placeholder="Enter message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="min-h-[100px]"
      />
      
      <Button onClick={handlePublish} className="w-full">
        Publish Message
      </Button>
    </div>
  )
} 