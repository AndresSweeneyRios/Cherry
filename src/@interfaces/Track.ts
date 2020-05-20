import { User } from "discord.js"

export interface Track {
  title: string
  description: string
  duration: string
  rawDuration: number
  thumbnail: string
  url: string
  author: User
}
