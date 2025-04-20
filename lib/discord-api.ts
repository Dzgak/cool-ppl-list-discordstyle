import { cache } from "react"
import { userCache, presenceCache, guildCache, fetchWithCache } from './cache'

// Types for Discord API responses
export interface DiscordUser {
  id: string
  username: string
  global_name?: string
  avatar: string | null
  banner?: string | null
  banner_color?: string | null
  discriminator: string
  public_flags: number
  bot?: boolean
}

export interface DiscordPresence {
  user: { id: string }
  status: "online" | "idle" | "dnd" | "offline"
  client_status: {
    desktop?: string
    mobile?: string
    web?: string
  }
}

export interface DiscordGuildMember {
  user: DiscordUser
  nick?: string
  roles: string[]
  joined_at: string
  premium_since?: string
  deaf: boolean
  mute: boolean
  pending?: boolean
}

// Badge mapping
export const DISCORD_BADGES: Record<number, string> = {
  1: "staff",
  2: "partner",
  4: "hypesquad_events",
  8: "bug_hunter_level_1",
  64: "house_bravery",
  128: "house_brilliance",
  256: "house_balance",
  512: "early_supporter",
  16384: "bug_hunter_level_2",
  131072: "developer",
  4194304: "active_developer",
}

// Helper to get user badges from flags
export function getUserBadges(flags: number): string[] {
  return Object.entries(DISCORD_BADGES)
    .filter(([flag]) => (flags & Number.parseInt(flag)) === Number.parseInt(flag))
    .map(([_, name]) => name)
}

// Type for loading logs
export type LoadingLog = {
  message: string
  type: 'info' | 'success' | 'error' | 'progress'
  timestamp: number
}

// Type for loading status
export type LoadingStatus = {
  message: string
  type: 'info' | 'success' | 'error' | 'progress'
  timestamp: number
  userData?: DiscordUser
}

// Cached API calls to Discord
export const getDiscordUsers = async (
  userIds: string[]
): Promise<{
  users: DiscordUser[]
  loadingStatus: LoadingStatus[]
}> => {
  const users: DiscordUser[] = []
  const loadingStatus: LoadingStatus[] = []

  try {
    const logStart: LoadingStatus = {
      message: `Starting to fetch ${userIds.length} users...`,
      type: "info",
      timestamp: Date.now()
    }
    loadingStatus.push(logStart)

    for (const [index, userId] of userIds.entries()) {
      // Check cache first
      const cached = userCache.get(userId)
      if (cached) {
        users.push(cached)
        loadingStatus.push({
          message: `✓ Loaded from cache: ${cached.username}`,
          type: "success",
          timestamp: Date.now(),
          userData: cached
        })
        continue
      }

      try {
        const logProgress: LoadingStatus = {
          message: `[${index + 1}/${userIds.length}] Fetching user ${userId}...`,
          type: "progress",
          timestamp: Date.now()
        }
        loadingStatus.push(logProgress)

        const userData = await fetchWithCache(`https://discord.com/api/v10/users/${userId}`, {
          headers: {
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          }
        })

        if (userData.banner) {
          const extension = userData.banner.startsWith('a_') ? 'gif' : 'png'
          userData.banner = `https://cdn.discordapp.com/banners/${userData.id}/${userData.banner}.${extension}?size=4096`
        }
        users.push(userData)
        userCache.set(userId, userData)
        const logSuccess: LoadingStatus = {
          message: `✓ Loaded ${userData.username}`,
          type: "success",
          timestamp: Date.now(),
          userData
        }
        loadingStatus.push(logSuccess)
      } catch (error) {
        const logError: LoadingStatus = {
          message: `✗ Error loading user ${userId}: ${error}`,
          type: "error",
          timestamp: Date.now()
        }
        loadingStatus.push(logError)
      }
    }

    // Debug: log what is returned
    console.log("getDiscordUsers logs:", loadingStatus)

    return { users, loadingStatus }
  } catch (error) {
    const logFatal: LoadingStatus = { 
      message: `Fatal error: ${error}`,
      type: "error",
      timestamp: Date.now()
    }
    return { 
      users: [], 
      loadingStatus: [logFatal]
    }
  }
}

export const getDiscordGuildMembers = cache(async (guildId: string): Promise<DiscordGuildMember[]> => {
  try {
    const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members?limit=100`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
      next: { revalidate: 30 }, // Cache for 30 seconds for more real-time updates
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch guild members: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching Discord guild members:", error)
    return []
  }
})

export const getDiscordPresences = cache(async (guildId: string): Promise<DiscordPresence[]> => {
  try {
    const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/presences`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
      next: { revalidate: 15 }, // Cache for 15 seconds for more real-time updates
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch presences: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching Discord presences:", error)
    return []
  }
})
