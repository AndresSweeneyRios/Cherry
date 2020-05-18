import { Track } from "./Track";
import { Message, VoiceConnection } from "discord.js";

export interface Music {
  connect (): Promise<VoiceConnection>
  playNext (): Promise<void>
  addTrack (track: Track): Promise<Message>
}