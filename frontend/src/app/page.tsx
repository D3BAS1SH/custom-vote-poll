"use client"

import { RealTimeProvider } from "@/context/realtime-context"
import Dashboard from "@/components/dasboard"

export default function Home() {
  return (
    <RealTimeProvider>
      <Dashboard />
    </RealTimeProvider>
  )
}
