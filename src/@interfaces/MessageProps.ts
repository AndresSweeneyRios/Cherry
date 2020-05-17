import { Message, MessageEmbed } from 'discord.js'

import { Queue } from './Queue';
import { Music } from './Music';

export interface MessageProps extends Message {
  send (content: string | { embed: MessageEmbed }): Promise<Message>
  embed (options: MessageEmbed): Promise<Message>
  quickEmbed (title?: string, description?: string, color?: string): Promise<Message>
  args: string[]
  queue: Queue
  music: Music
}
