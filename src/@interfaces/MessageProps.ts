import {
  Message, 
  MessageEmbed, 
} from 'discord.js'

import { Queue } from './Queue'
import { Music } from './Music'
import { Search } from './Search'

export interface MessageProps extends Message {
  send (content: string | { embed: MessageEmbed }): Promise<Message>
  embed (options: MessageEmbed): Promise<Message>
  quickEmbed (title?: string, description?: string, color?: string): Promise<Message>
  args: string[]
  queue: Queue
  search: Search
  music: Music
  refreshListeners (): Promise<void>
}
