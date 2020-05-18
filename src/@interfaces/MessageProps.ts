import { Message, MessageEmbed } from 'discord.js'

import { Queue } from './Queue';
import { Music } from './Music';
import { Search } from './Search';

import { youtube_v3 } from 'googleapis'

export interface MessageProps extends Message {
  send (content: string | { embed: MessageEmbed }): Promise<Message>
  embed (options: MessageEmbed): Promise<Message>
  quickEmbed (title?: string, description?: string, color?: string): Promise<Message>
  args: string[]
  queue: Queue
  search: Search
  music: Music
  youtube: youtube_v3.Youtube
}
