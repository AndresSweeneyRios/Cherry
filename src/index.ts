import { Client } from 'discord.js'

import { Props } from './@interfaces'

import config from './config'

import readyHandler from './handlers/ready'
import messageHandler from './handlers/message'

import { google } from 'googleapis'

const youtube = google.youtube({
  version: 'v3',
  auth: config.youtubeAPIKey,
})

const client = new Client()

const props: Props = {
  client,
  queues: {},
  searches: {},
  youtube,
}

client.on('ready', readyHandler(props))

client.on('message', messageHandler(props))

client.login(config.token)
