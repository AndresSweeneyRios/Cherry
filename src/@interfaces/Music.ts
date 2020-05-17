import { Track } from "./Track";
import { Message } from "discord.js";

export interface Music {
  playNext (): void
  addTrack (track: Track): Promise<Message>
}