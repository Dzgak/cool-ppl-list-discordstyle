"use client"

import { useEffect, useState } from "react"
import { UserCard } from "@/components/user-card"
import { UserSearch } from "@/components/user-search"
import { UserProfileModal } from "@/components/user-profile-modal"
import { motion } from "framer-motion"
import { fetchDiscordUsers, type UserData } from "@/app/actions"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { type LoadingStatus } from "@/lib/discord-api"
import { cn } from "@/lib/utils"

// Optional guild ID - if not provided, will use sample users
const GUILD_ID = "" // Add your Discord server ID here if you have one
const USERS_PER_PAGE = 5

export function UserList() {
  const [users, setUsers] = useState<UserData[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([])
  const [visibleUsers, setVisibleUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const { toast } = useToast()
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadedCount, setLoadedCount] = useState(0)
  const [loadingLogs, setLoadingLogs] = useState<LoadingStatus[]>([])
  const totalExpectedUsers = 2 // Changed from 20 to 2 since we only fetch 2 users

  // Function to load users
  const loadUsers = async () => {
    try {
      setLoading(true)
      setLoadingProgress(0)
      setLoadedCount(0)
      // Clear logs for new fetch
      setLoadingLogs([])

      const { users: data, loadingStatus } = await fetchDiscordUsers(GUILD_ID || undefined, searchQuery)
      
      // Process each log entry sequentially to simulate real-time updates
      for (const log of loadingStatus) {
        setLoadingLogs(prev => [...prev, log])
        
        // Update progress based on log type
        if (log.type === "success") {
          setLoadedCount(prev => prev + 1)
          setLoadingProgress(prev => (prev + (100 / totalExpectedUsers)))
        }
      }

      const validUsers = data.filter((user) => user.id && user.username)
      setUsers(validUsers)
      setFilteredUsers(validUsers)
      setError(null)
    } catch (err) {
      console.error("Failed to load Discord users:", err)
      setError("Failed to load users. Please try again later.")
      setLoadingLogs(prev => [...prev, {
        message: `Error: ${err}`,
        type: "error" as const,
        timestamp: Date.now()
      }])
    } finally {
      setLoading(false)
    }
  }

  // Initial load only (not on search)
  useEffect(() => {
    loadUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Handle search (filter client-side, don't reload from server)
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setPage(1) // Reset pagination when searching

    if (!query) {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter(
        (user) =>
          user.username.toLowerCase().includes(query.toLowerCase()) ||
          (user.displayName && user.displayName.toLowerCase().includes(query.toLowerCase())) ||
          (user.customStatus && user.customStatus.toLowerCase().includes(query.toLowerCase())),
      )
      setFilteredUsers(filtered)
    }
  }

  // Update visible users when filtered users or page changes
  useEffect(() => {
    const startIndex = 0
    const endIndex = page * USERS_PER_PAGE
    setVisibleUsers(filteredUsers.slice(startIndex, endIndex))
  }, [filteredUsers, page])

  // Handle load more
  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1)
  }

  // Handle user click
  const handleUserClick = (user: UserData) => {
    setSelectedUser(user)
    setProfileOpen(true)
  }

  if (loading && users.length === 0) {
    // Find the last progress log index
    const lastProgressIdx = loadingLogs.map(l => l.type).lastIndexOf("progress")
    console.log("Render loadingLogs:", loadingLogs)
    return (
      <div className="w-full max-w-md mx-auto py-12 space-y-4">
        <div className="flex items-center justify-center mb-4">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <span className="ml-2 text-muted-foreground">Loading users...</span>
        </div>
        <div className="bg-muted/50 rounded-lg p-4 pt-0 max-h-[300px] overflow-y-auto space-y-1 font-mono text-xs">
          <div className="sticky top-0 bg-muted/50 p-2 -m-4 mb-2 border-b">
            Progress: {Math.round(loadingProgress)}% ({loadedCount}/{totalExpectedUsers})
          </div>
          <br/>
          {loadingLogs.length === 0 ? (
            <div className="text-muted-foreground italic">
              No logs yet (dev: check console).<br />
              {loading ? "If this persists, check your Discord bot token and network." : null}
            </div>
          ) : (
            loadingLogs.map((log, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-2 transition-colors duration-150",
                  {
                    "text-sky-500": log.type === "info",
                    "text-green-500": log.type === "success",
                    "text-red-500": log.type === "error",
                    "text-muted-foreground": log.type === "progress"
                  }
                )}
              >
                {/* Show avatar for success logs if available */}
                {log.type === "success" && log.userData?.avatar && (
                  <img
                    src={
                      log.userData.avatar.startsWith("http")
                        ? log.userData.avatar
                        : `https://cdn.discordapp.com/avatars/${log.userData.id}/${log.userData.avatar.startsWith("a_") ? log.userData.avatar + ".gif" : log.userData.avatar + ".png"}`
                    }
                    alt={log.userData.username}
                    className="w-5 h-5 rounded-full inline-block"
                    style={{ minWidth: 20, minHeight: 20 }}
                  />
                )}
                {/* Show username for success logs */}
                {log.type === "success" && log.userData?.username && (
                  <span className="font-semibold">{log.userData.username}</span>
                )}
                {/* Show spinner for the last progress log */}
                {log.type === "progress" && i === lastProgressIdx && (
                  <Loader2 className="w-3 h-3 mr-1 animate-spin inline-block" />
                )}
                <span>{log.message}</span>
              </div>
            ))
          )}
        </div>
        <div className="text-center text-sm text-muted-foreground">
          <p>Loaded {loadedCount} of ~{totalExpectedUsers} users</p>
        </div>
      </div>
    )
  }

  if (error && users.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto text-center py-12">
        <p className="text-destructive">{error}</p>
        <button
          onClick={loadUsers}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
        >
          Retry
        </button>
      </div>
    )
  }

  // Count online users (online, idle, dnd)
  const onlineCount = filteredUsers.filter((user) => user.status !== "offline").length

  return (
    <motion.div
      className="w-full max-w-md mx-auto space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <UserSearch onSearch={handleSearch} />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          {searchQuery ? `Results — ${filteredUsers.length}` : `Members (${onlineCount} online)`}
        </h2>
        <div className="text-xs text-muted-foreground">
          {filteredUsers.length} {filteredUsers.length === 1 ? "member" : "members"}
        </div>
      </div>

      {loading && users.length > 0 && (
        <div className="flex justify-center my-4">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
          <span className="ml-2 text-sm text-muted-foreground">Refreshing...</span>
        </div>
      )}

      {/* Group users by status */}
      <div className="space-y-4">
        {visibleUsers.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No users found</p>
        ) : (
          <>
            {/* Online users first */}
            {visibleUsers
              .filter((user) => user.status === "online")
              .map((user) => (
                <UserCard key={user.id} user={user} onClick={() => handleUserClick(user)} />
              ))}

            {/* Idle users */}
            {visibleUsers
              .filter((user) => user.status === "idle")
              .map((user) => (
                <UserCard key={user.id} user={user} onClick={() => handleUserClick(user)} />
              ))}

            {/* Do Not Disturb users */}
            {visibleUsers
              .filter((user) => user.status === "dnd")
              .map((user) => (
                <UserCard key={user.id} user={user} onClick={() => handleUserClick(user)} />
              ))}

            {/* Offline users last */}
            {visibleUsers
              .filter((user) => user.status === "offline")
              .map((user) => (
                <UserCard key={user.id} user={user} onClick={() => handleUserClick(user)} />
              ))}
          </>
        )}
      </div>

      {/* Load more button */}
      {filteredUsers.length > visibleUsers.length && (
        <div className="flex justify-center mt-6">
          <Button onClick={handleLoadMore} variant="outline" className="w-full">
            Load More ({visibleUsers.length} of {filteredUsers.length})
          </Button>
        </div>
      )}

      {/* User profile modal */}
      <UserProfileModal user={selectedUser} open={profileOpen} onOpenChange={setProfileOpen} />
    </motion.div>
  )
}
