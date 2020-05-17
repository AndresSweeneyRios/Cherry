import { MessageEmbed, Message } from 'discord.js'

import { testCommand } from '../commands'
import { accent } from '../colors'

import { Props, MessageProps, Track } from '../@interfaces'

import music from './music'

const messageHandler = (props: Props) => ( message: Message ): Promise<void> => {
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

  props.queues[message.guild.id] = props.queues[message.guild.id] || {
    connection: null,
    channel: null,
    dispatcher: null,
    currentlyPlaying: null,
    tracks: [],
  }

  const queue = props.queues[message.guild.id]

  const messageProps: MessageProps = Object.assign(
    message, 
    {
      send,
      embed,
      quickEmbed,
      args: [],
      queue,
      music: music({ embed, queue }),
    }
  )

  testCommand(messageProps).catch(console.error)
}

export default messageHandler
