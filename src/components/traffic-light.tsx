"use client"

import { cn } from "@/lib/utils"

type LightState = "idle" | "red" | "yellow" | "green"

interface TrafficLightProps {
  currentState: LightState
}

export function TrafficLight({ currentState }: TrafficLightProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-zinc-800 p-4 rounded-lg space-y-4 shadow-lg">
        {/* Red Light */}
        <div
          className={cn(
            "w-24 h-24 rounded-full border-4 border-zinc-700",
            currentState === "red" ? "bg-red-500" : "bg-red-950/30"
          )}
        />
        {/* Yellow Light */}
        <div
          className={cn(
            "w-24 h-24 rounded-full border-4 border-zinc-700",
            currentState === "yellow" ? "bg-yellow-400" : "bg-yellow-950/30"
          )}
        />
        {/* Green Light */}
        <div
          className={cn(
            "w-24 h-24 rounded-full border-4 border-zinc-700",
            currentState === "green" ? "bg-green-500" : "bg-green-950/30"
          )}
        />
      </div>
    </div>
  )
} 