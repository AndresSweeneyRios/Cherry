import { Client } from 'discord.js'

import { Queue } from './Queue'
import { Search } from './Search'

export interface Props {
  client: Client

  queues: {
    [guildId: string]: Queue
  }

  searches: {
    [guildId: string]: {
      [authorId: string]: Search
    }
  }

  refreshListeners? (): Promise<void>
}
