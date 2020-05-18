import { MessageEmbed, Message } from 'discord.js'

import { testCommand } from '../commands'
import { accent } from '../colors'

import { Props, MessageProps, Track, Search } from '../@interfaces'

import music from './music'

const messageHandler = (props: Props) => (message: Message): Promise<void> => {
  if (!message.guild || message.author.bot) return

  const send = (content: string | { embed: MessageEmbed }): Promise<Message> => {
    return message.channel.send(content)
  }

  const embed = ( options: MessageEmbed ): Promise<Message> => {
    const embed = {
      author: { 
        icon_url: message.author.avatarURL(), 
        name: message.author.username,
      },
      // timestamp: new Date(),
      color: accent,
      ...options
    } as MessageEmbed

    return send({ embed })
  }

  const quickEmbed = ( title?: string, description?: string, color?: string ): Promise<Message> => {
    return embed({
      title,
      description,
    } as MessageEmbed)
  }

  const { guild, author } = message

  const { queues, searches } = props

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
    youtube: props.youtube,
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
