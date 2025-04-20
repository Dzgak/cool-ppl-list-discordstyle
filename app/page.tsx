"use client"

import { UserList } from "@/components/user-list"
import { ThemeToggle } from "@/components/theme-toggle"
import { RefreshButton } from "@/components/refresh-button"
import { useState, useRef } from "react"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  const [key, setKey] = useState(0)
  const userListRef = useRef<{ handleRefresh: () => Promise<void> } | null>(null)

  const handleRefresh = async () => {
    if (userListRef.current?.handleRefresh) {
      await userListRef.current.handleRefresh()
    } else {

      setKey((prev) => prev + 1)
    }
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="fixed top-4 right-4 z-10 flex gap-2">
        <RefreshButton onRefresh={handleRefresh} />
        <ThemeToggle />
      </div>
      <div className="container max-w-4xl mx-auto pt-12">
        <UserList key={key} />
      </div>
      <Toaster />
    </main>
  )
}
