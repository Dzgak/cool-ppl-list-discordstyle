"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BadgeIcon } from "@/components/badge-icon"
import { Clock, Hash, Music, X, Globe, Gamepad, Video } from "lucide-react"
import type { UserData } from "@/app/actions"
import { formatDistanceToNow } from "date-fns"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

interface UserProfileModalProps {
  user: UserData | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserProfileModal({ user, open, onOpenChange }: UserProfileModalProps) {
  const [activeTab, setActiveTab] = useState<"about" | "roles">("about")
  const [effectKey, setEffectKey] = useState(0)
  const [effectSrc, setEffectSrc] = useState<string | null>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined
    let isMounted = true

    async function fetchEffect() {
      if (!user?.id || user.id !== "1287660832133611520" || !open) {
        setEffectSrc(null)
        return
      }
      // Force re-fetch by adding a cache-busting query param
      const url = `https://cdn.discordapp.com/assets/profile_effects/effects/2025-04-05/f_in_chat_black/intro.png?cb=${Date.now()}`
      setEffectSrc(url)
      setEffectKey(key => key + 1)
    }

    if (user?.id === "1287660832133611520" && open) {
      fetchEffect()
      interval = setInterval(() => {
        if (isMounted) fetchEffect()
      }, 8000)
    }

    return () => {
      isMounted = false
      if (interval) clearInterval(interval)
    }
  }, [user?.id, open])

  if (!user) return null

  const hasProfileEffect = user.id === "1287660832133611520"

  // Format badge display names
  const formatBadge = (badge: string) => {
    return badge
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Status colors
  const statusColors = {
    online: "bg-green-500",
    idle: "bg-yellow-500",
    dnd: "bg-red-500",
    offline: "bg-gray-500",
  }

  // Status text
  const statusText = {
    online: "Online",
    idle: "Idle",
    dnd: "Do Not Disturb",
    offline: "Offline",
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
        {hasProfileEffect && effectSrc && (
          <div key={effectKey} className="absolute top-0 inset-0 pointer-events-none z-[1] animate-profileEffect overflow-hidden">
            <img
              src={effectSrc}
              alt="Profile Effect"
              className="w-full h-auto"
            />
          </div>
        )}
        <DialogHeader className="relative">
          <div className="h-32 bg-primary/10 -mx-6 -mt-6 rounded-t-lg relative">
            {/* Banner */}
            {user.banner ? (
              <>
                <img
                  src={user.banner}
                  alt="Profile banner"
                  className="w-full h-full object-cover"
                />
              </>
            ) : (
              <div className="w-full h-full bg-primary/10" />
            )}
            {/* Avatar with decoration */}
            <div className="absolute -bottom-10 left-4 z-20">
              <div className="relative">
                {hasProfileEffect && (
                  <img
                    src="https://cdn.discordapp.com/avatar-decoration-presets/a_fbbdd5565db1c91d95804f7df0074c5a.png?size=300&passthrough=true"
                    alt="Avatar Decoration"
                    className="absolute -inset-3 w-[108px] h-[108px] object-contain z-10"
                  />
                )}
                <div className="w-[84px] h-[84px] rounded-full overflow-hidden bg-background border-[6px] border-background relative z-0">
                  {user.avatar ? (
                    <img
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-medium text-2xl">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <VisuallyHidden>
            <DialogTitle>User Profile - {user.displayName || user.username}</DialogTitle>
          </VisuallyHidden>
        </DialogHeader>

        <div className="mt-8">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{user.displayName || user.username}</h2>
              <div className="flex items-center gap-1">
                {user.badges.map((badge, index) => (
                  <BadgeIcon key={index} type={badge} />
                ))}
              </div>
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              {user.username}
              {user.discriminator !== "0" && (
                <>
                  <span className="text-muted-foreground/50">#</span>
                  {user.discriminator}
                </>
              )}
            </div>
          </div>

          <div className="space-y-4 mt-6">
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground mb-2">DISCORD MEMBER SINCE</h3>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>
                  {formatDistanceToNow(new Date(Number.parseInt(user.id) / 4194304 + 1420070400000), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground mb-2">USER ID</h3>
              <div className="flex items-center gap-2 text-sm">
                <Hash className="h-4 w-4" />
                <span>{user.id}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
