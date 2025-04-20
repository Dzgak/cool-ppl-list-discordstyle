"use client"

import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import type { UserData } from "@/app/actions"

interface UserCardProps {
  user: UserData
  onClick: () => void
}

export function UserCard({ user, onClick }: UserCardProps) {
  const statusColors = {
    online: "bg-green-500",
    idle: "bg-yellow-500",
    dnd: "bg-red-500",
    offline: "bg-gray-500",
  }

  return (
    <motion.div
      className="w-full rounded-lg overflow-hidden cursor-pointer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
    >
      <div className="bg-card border border-border/40 rounded-lg overflow-hidden hover:bg-accent/30 transition-colors">
        <div className="p-3 flex items-center gap-3">
          {}
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-accent">
              {user.avatar ? (
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.username}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                    e.currentTarget.parentElement!.innerHTML =
                      `<div class="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-medium">${user.username
                        .charAt(0)
                        .toUpperCase()}</div>`
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-medium">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            {
}
          </div>

          {}
          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-foreground truncate">{user.displayName || user.username}</h3>
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {user.username}
              {user.discriminator !== "0" && `#${user.discriminator}`}
            </p>
            {user.customStatus && <p className="text-xs text-primary/80 truncate mt-0.5">{user.customStatus}</p>}
          </div>

          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </motion.div>
  )
}
