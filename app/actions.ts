"use server"

import {
  getDiscordUsers,
  getDiscordGuildMembers,
  getDiscordPresences,
  getUserBadges,
  type DiscordUser,
  type DiscordPresence,
  type LoadingLog,
  type LoadingStatus,
} from "@/lib/discord-api"

const SAMPLE_USER_IDS = [
  "1287660832133611520", 
  "601508234632888320", 
  "1012383875810476102", 
  "951692654083719199", 
  "1097860570318897272", 
  "912292782373216276", 
  "1093942698664276129", 
  "691995909634129941", 
  "444255651397632001", 
  "722715868789866507", 
  "1014836365516615760", 
  "1002377371892072498", 
  "807477336588812308", 
  "1210948757508591666", 
  "767437270323429377", 
  "777305854931370026", 
  "981421662341824552", 
  "1138867088400855102", 
  "1157544020143255614", 
  "1018206700517470228", 
]

const CUSTOM_BADGES: Record<string, string> = {
  "1287660832133611520": "slave owner", 
  "601508234632888320": "admin", 
}

const CACHE_DURATION = 60000 
const userCache = new Map<string, { data: DiscordUser; timestamp: number }>()
const presenceCache = new Map<string, { data: DiscordPresence; timestamp: number }>()

async function batchFetchUsers(
  userIds: string[]
): Promise<{ users: DiscordUser[], logs: LoadingStatus[] }> {
  const now = Date.now()
  const fetchNeeded: string[] = []
  const cachedUsers: DiscordUser[] = []
  const logs: LoadingStatus[] = []

  userIds.forEach(id => {
    const cached = userCache.get(id)
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      cachedUsers.push(cached.data)
      const log: LoadingStatus = {
        message: `✓ Loaded from cache: ${cached.data.username}`,
        type: "success",
        timestamp: now,
        userData: cached.data
      }
      logs.push(log)
    } else {
      fetchNeeded.push(id)
    }
  })

  let fetchedUsers: DiscordUser[] = []
  let fetchedLogs: LoadingStatus[] = []
  if (fetchNeeded.length > 0) {
    const result = await getDiscordUsers(fetchNeeded)
    fetchedUsers = result.users
    fetchedLogs = result.loadingStatus
  }

  return {
    users: [...cachedUsers, ...fetchedUsers],
    logs: [...logs, ...fetchedLogs]
  }
}

export interface UserData {
  id: string
  username: string
  displayName?: string
  discriminator: string
  avatar?: string
  banner?: string
  bannerColor?: string | null
  status: "online" | "idle" | "dnd" | "offline"
  badges: string[]
  bot?: boolean
  customStatus?: string
}

export async function fetchDiscordUsers(
  guildId?: string, 
  searchQuery?: string
): Promise<{ users: UserData[], loadingStatus: LoadingStatus[] }> {
  try {
    let discordUsers: DiscordUser[] = []
    let presences: DiscordPresence[] = []
    const memberRoles: Record<string, string[]> = {}
    let loadingStatus: LoadingStatus[] = []

    if (guildId) {
      const members = await getDiscordGuildMembers(guildId)
      discordUsers = members.map((member) => member.user)

      members.forEach((member) => {
        memberRoles[member.user.id] = member.roles
      })

      presences = await getDiscordPresences(guildId)
    } else {
      const { users: fetchedUsers, logs } = await batchFetchUsers(SAMPLE_USER_IDS)
      discordUsers = fetchedUsers
      loadingStatus = logs

      const now = Date.now()
      presences = await Promise.all(
        discordUsers.map(async (user) => {
          const cached = presenceCache.get(user.id)
          if (cached && (now - cached.timestamp) < 30000) { 
            return cached.data
          }

          try {
            const presenceData = await fetch(`https://discord.com/api/v10/users/${user.id}/presence`, {
              headers: {
                Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
              },
              next: { revalidate: 30 }, 
            })

            if (presenceData.ok) {
              const presence = await presenceData.json()
              presenceCache.set(user.id, { data: presence, timestamp: now })
              return presence
            }
          } catch (error) {
            console.error(`Error fetching presence for user ${user.id}:`, error)
          }

          return {
            user: { id: user.id },
            status: "offline",
            activities: [],
            client_status: {},
          }
        })
      )
    }

    let userData = discordUsers
      .filter((user) => !user.bot) 
      .map((user) => {
        const presence = presences.find((p) => p.user.id === user.id) || {
          status: "offline",
          activities: [],
          client_status: {},
        }

        const systemBadges = getUserBadges(user.public_flags || 0)
        const customBadges = memberRoles[user.id]?.map((roleId) => CUSTOM_BADGES[roleId]).filter(Boolean) || []
        const allBadges = [...systemBadges, ...customBadges]

        let avatarUrl: string | undefined = undefined
        if (user.avatar) {
          const extension = user.avatar.startsWith("a_") ? "gif" : "png"
          avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${extension}`
        }

        let bannerUrl: string | undefined = undefined
        if (user.banner) {
          bannerUrl = user.banner 
        }

        return {
          id: user.id,
          username: user.username,
          displayName: user.global_name,
          discriminator: user.discriminator,
          avatar: avatarUrl,
          banner: bannerUrl,
          bannerColor: user.banner_color || null,
          status: presence.status,
          badges: allBadges,
        }
      })

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      userData = userData.filter(
        (user) =>
          user.username.toLowerCase().includes(query) ||
          (user.displayName && user.displayName.toLowerCase().includes(query))
      )
    }

    return { users: userData, loadingStatus }
  } catch (error) {
    console.error("Error in fetchDiscordUsers:", error)
    return {
      users: [],
      loadingStatus: [{
        message: `Error fetching users: ${error}`,
        type: 'error',
        timestamp: Date.now()
      }]
    }
  }
}