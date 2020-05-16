import { Message, MessageEmbed } from 'discord.js'

import { Queue } from './Queue';
import { Track } from './Track';

export interface MessageProps extends Message {
  send (content: string | { embed: MessageEmbed }): Promise<Message>
  embed (options: MessageEmbed): Promise<Message>
  quickEmbed (title?: string, description?: string, color?: string): Promise<Message>
  args: string[]
  queue: Queue
  playNext (): void
  addTrack (track: Track): number
}
