/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */

import {
  MessageEmbed, 
  Message, 
} from 'discord.js'

import { testCommand } from '../commands'
import { accent } from '../utils/colors'

import {
  Props, 
  MessageProps,
} from '../@interfaces'

import music from './music'

import config from '../config'

const messageHandler = (props: Props) => (message: Message): Promise<void> => {
  const { guild, author } = message

  const { NODE_ENV } = process.env

  if (!guild || author.bot) return

  if (guild.id === config.devServer && NODE_ENV === 'production') return
  if (guild.id !== config.devServer && NODE_ENV === 'development') return

  const send = (content: string | { embed: MessageEmbed }): Promise<Message> => {
    return message.channel.send(content)
  }

  const embed = (options: MessageEmbed): Promise<Message> => {
    const embed = {
      author: { 
        icon_url: message.author.avatarURL(), 
        name: message.author.username,
      },
      // timestamp: new Date(),
      color: accent,
      ...options,
    } as MessageEmbed

    return send({ embed })
  }

  const quickEmbed = (title?: string, description?: string, color?: string): Promise<Message> => {
    return embed({
      title,
      description,
      color,
    } as { color: number | string } as MessageEmbed)
  }

  const { queues, searches, refreshListeners } = props

  queues[guild.id] = queues[guild.id] || {
    connection: null,
    channel: null,
    dispatcher: null,
    currentlyPlaying: null,
    tracks: [],
  }

  const queue = props.queues[guild.id]

  if (!searches[guild.id]) searches[guild.id] = {}

  if (!searches[guild.id][author.id]) searches[guild.id][author.id] = {
    tracks: [],
    date: 0,
  }

  const search = searches[guild.id][author.id]

  const partialMessageProps = Object.assign(message, {
    send,
    embed,
    quickEmbed,
    args: [],
    queue,
    search,
    refreshListeners,
  } as MessageProps)

  const messageProps: MessageProps = Object.assign(
    partialMessageProps,
    {
      music: music(partialMessageProps),
    },
  )

  testCommand(messageProps).catch(console.error)
}

export default messageHandler
