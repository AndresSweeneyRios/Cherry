import { Track } from "./Track"
import { Message } from "discord.js"

export interface Search {
  tracks: Track[]
  date: number
  message?: Message
}
