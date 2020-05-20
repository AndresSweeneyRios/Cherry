import { Client } from 'discord.js'

import { Props } from './@interfaces'

import config from './config'

import readyHandler from './handlers/ready'
import messageHandler from './handlers/message'
import voiceStateHandler from './handlers/voiceState'

const client = new Client()

const props: Props = {
  client,
  queues: {},
  searches: {},
}

client.on('ready', readyHandler(props))

client.on('voiceStateUpdate', voiceStateHandler(props))

client.on('message', messageHandler(props))

client.login(config.token)
