import { MessageEmbed, Message } from 'discord.js'

import { testCommand } from '../commands'
import { accent } from '../colors'

import { Props, MessageProps, Track } from '../@interfaces'

const messageHandler = (props: Props) => ( message: Message ): Promise<void> => {
  if (!message.guild || message.author.bot) return

  const send = (content: string | { embed: MessageEmbed }): Promise<Message> => {
    console.log({ content })
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

  const quickEmbed = ( title?: string, description?: string ): Promise<Message> => {
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

  const playNext = () => {
    if (queue.tracks.length === 0 && queue.connection) {
      queue.connection.disconnect()

      Object.assign(queue, { 
        connection: null, 
        channel: null, 
        dispatcher: null,
        currentlyPlaying: null,
      })
    } else {
      const [ track ] = queue.tracks.splice(0, 1)

      if (queue.dispatcher) queue.dispatcher.end()

      Object.assign(queue, {
        dispatcher: queue.connection.play(track.url),
        currentlyPlaying: track,
      })
    }
  }

  const addTrack = (track: Track): number => {
    const position = queue.tracks.push(track)

    if (!queue.dispatcher) {
      playNext()

      return 0
    } else {
      return position
    }
  }

  const messageProps: MessageProps = Object.assign(
    message, 
    {
      send,
      embed,
      quickEmbed,
      args: [],
      queue,
      playNext,
      addTrack,
    }
  )

  testCommand(messageProps).catch(console.error)
}

export default messageHandler
