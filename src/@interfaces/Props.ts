import { Client } from 'discord.js'

import { Queue } from './Queue'
import { Search } from './Search'

import { youtube_v3 } from 'googleapis'

export interface Props {
  client: Client
  queues: {
    [guildId: string]: Queue
  }
  youtube: youtube_v3.Youtube
  searches: {
    [guildId: string]: {
      [authorId: string]: Search
    }
  }
}
