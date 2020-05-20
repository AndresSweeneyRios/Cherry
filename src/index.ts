import { Client } from 'discord.js'

import { Props } from './@interfaces'

import config from './config'

import readyHandler from './handlers/ready'
import messageHandler from './handlers/message'

const client = new Client()

const props: Props = {
  client,
  queues: {},
  searches: {},
}

const refreshListeners = async (): Promise<void> => {
  if (typeof require !== 'undefined') {
    for (const key of Object.keys(require.cache)) {
      if (key.endsWith('.js')) {
        delete require.cache[key]
      }
    }
  }

  const messageHandler = await import('./handlers/message')
  const readyHandler = await import('./handlers/ready')

  const messageListener = messageHandler.default(props)
  const readyListener = readyHandler.default(props)

  client.removeAllListeners()

  client.on('ready', readyListener)
  client.on('message', messageListener)
}

props.refreshListeners = refreshListeners

client.on('ready', readyHandler(props))
client.on('message', messageHandler(props))

client.login(config.token)
