import { Client } from 'discord.js'

import { Queue } from './Queue'

export interface Props {
  client: Client
  queues: {
    [key: string]: Queue
  }
}
