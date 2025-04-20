"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Image from "next/image"

interface BadgeIconProps {
  type: string
  className?: string
}

const BADGE_ICONS: Record<string, { src: string; label: string }> = {
  staff: {
    src: "/assets/discordstaff.svg",
    label: "Discord Staff",
  },
  partner: {
    src: "/assets/discordpartner.svg",
    label: "Partnered Server Owner",
  },
  hypesquad_events: {
    src: "/assets/hypesquadevents.svg",
    label: "HypeSquad Events",
  },
  bug_hunter_level_1: {
    src: "/assets/discordbughunter1.svg",
    label: "Discord Bug Hunter (Tier 1)",
  },
  bug_hunter_level_2: {
    src: "/assets/discordbughunter2.svg",
    label: "Discord Bug Hunter (Tier 2)",
  },
  active_developer: {
    src: "/assets/activedeveloper.svg",
    label: "Active Developer",
  },
  house_bravery: {
    src: "/assets/hypesquadbravery.svg",
    label: "HypeSquad Bravery",
  },
  house_brilliance: {
    src: "/assets/hypesquadbrilliance.svg",
    label: "HypeSquad Brilliance",
  },
  house_balance: {
    src: "/assets/hypesquadbalance.svg",
    label: "HypeSquad Balance",
  },
  early_supporter: {
    src: "/assets/discordearlysupporter.svg",
    label: "Early Supporter",
  },
  developer: {
    src: "/assets/discordbotdev.svg",
    label: "Early Verified Bot Developer",
  },
  mod_alumni: {
    src: "/assets/discordmod.svg",
    label: "Moderator Programs Alumni",
  },
  nitro: {
    src: "/assets/discordnitro.svg",
    label: "Discord Nitro",
  },
  // Additional badges from reference
  orb: {
    src: "/assets/orb.svg",
    label: "Orbs",
  },
  quest: {
    src: "/assets/quest.png",
    label: "Completed a Quest",
  },
  username: {
    src: "/assets/username.png",
    label: "Originally known as",
  },
  premium_bot: {
    src: "/assets/premiumbot.png",
    label: "Premium Bot",
  },
  // Nitro Subscription Tiers
  nitro_bronze: {
    src: "/assets/subscriptions/badges/bronze.png",
    label: "Nitro Bronze (1 Month)",
  },
  nitro_silver: {
    src: "/assets/subscriptions/badges/silver.png",
    label: "Nitro Silver (3 Months)",
  },
  nitro_gold: {
    src: "/assets/subscriptions/badges/gold.png",
    label: "Nitro Gold (6 Months)",
  },
  nitro_platinum: {
    src: "/assets/subscriptions/badges/platinum.png",
    label: "Nitro Platinum (12 Months)",
  },
  nitro_diamond: {
    src: "/assets/subscriptions/badges/diamond.png",
    label: "Nitro Diamond (24 Months)",
  },
  nitro_emerald: {
    src: "/assets/subscriptions/badges/emerald.png",
    label: "Nitro Emerald (36 Months)",
  },
  nitro_ruby: {
    src: "/assets/subscriptions/badges/ruby.png",
    label: "Nitro Ruby (60 Months)",
  },
  nitro_opal: {
    src: "/assets/subscriptions/badges/opal.png",
    label: "Nitro Opal (72+ Months)",
  },
  // Server Boost Badges
  boost_1: {
    src: "/assets/boosts/discordboost1.svg",
    label: "Server Boosting (1 Month)",
  },
  boost_2: {
    src: "/assets/boosts/discordboost2.svg",
    label: "Server Boosting (2 Months)",
  },
  boost_3: {
    src: "/assets/boosts/discordboost3.svg",
    label: "Server Boosting (3 Months)",
  },
  boost_6: {
    src: "/assets/boosts/discordboost4.svg",
    label: "Server Boosting (6 Months)",
  },
  boost_9: {
    src: "/assets/boosts/discordboost5.svg",
    label: "Server Boosting (9 Months)",
  },
  boost_12: {
    src: "/assets/boosts/discordboost6.svg",
    label: "Server Boosting (1 Year)",
  },
  boost_15: {
    src: "/assets/boosts/discordboost7.svg",
    label: "Server Boosting (1 Year & 3 Months)",
  },
  boost_18: {
    src: "/assets/boosts/discordboost8.svg",
    label: "Server Boosting (1 Year & 6 Months)",
  },
  boost_24: {
    src: "/assets/boosts/discordboost9.svg",
    label: "Server Boosting (2 Years)",
  },
  // Custom badges
  admin: {
    src: "/assets/admin.svg",
    label: "Server Admin",
  },
  mod: {
    src: "/assets/mod.svg",
    label: "Server Moderator",
  },
  vip: {
    src: "/assets/vip.svg",
    label: "VIP Member",
  },
  contributor: {
    src: "/assets/contributor.svg",
    label: "Project Contributor",
  },
}

export function BadgeIcon({ type, className = "" }: BadgeIconProps) {
  const badge = BADGE_ICONS[type]
  if (!badge) return null

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className={`w-6 h-6 relative ${className}`}>
            <Image
              src={badge.src}
              alt={badge.label}
              width={24}
              height={24}
              className="w-full h-full"
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm font-medium">{badge.label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
