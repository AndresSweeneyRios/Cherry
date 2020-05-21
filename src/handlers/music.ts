import {
  MessageEmbed, 
  Message, 
  StreamDispatcher, 
  VoiceConnection, 
} from "discord.js"

import {
  Track, 
  Music, 
  MessageProps,
} from "../@interfaces"

import { red } from '../utils/colors'

import ytdlCore from 'ytdl-core'

export default ({
  queue, quickEmbed, embed, member, 
}: MessageProps): Music => {
  const connect = async (): Promise<VoiceConnection> => {
    const { channel } = member.voice

    if (!channel) {
      await quickEmbed(null, 'You must join a voice channel first.', red)
      
      return
    }

    if (queue.channel && channel.id === queue.channel.id && queue.connection) return queue.connection

    const connection = await channel.join()

    connection.on("error", console.error)

    queue.connection = connection
    queue.channel = channel

    connection.on("disconnect", () => {
      queue.connection = null
      queue.channel = null
    })

    return connection
  }

  const playNext = async (): Promise<void> => {
    if (queue.tracks.length === 0 && queue.connection) {
      // queue.connection.disconnect()

      Object.assign(queue, { 
        // connection: null, 
        // channel: null, 
        dispatcher: null,
        currentlyPlaying: null,
      })
    } else {
      const [track] = queue.tracks.splice(0, 1)

      if (queue.dispatcher) queue.dispatcher.end()

      const isYoutube = /youtube\.com|youtu\.be/.test(track.url)

      /* 
        ytdl-core fixes a bug with youtube audio streams
        https://github.com/discordjs/discord.js/issues/3362
      */

      const bitrate = 128
      const type = isYoutube ? 'opus' : null
      const highWaterMark = 1028 * 128

      const ytdl = isYoutube ? await ytdlCore(track.url, {
        highWaterMark,
        requestOptions: {
          maxRetries: 50,
        },
      }) : null

      if (ytdl) {
        ytdl.on('error', console.error)
      }

      const source =  ytdl || track.url

      const dispatcher: StreamDispatcher = queue.connection.play(source, {
        bitrate,
        type,
        highWaterMark, 
      })

      Object.assign(queue, {
        dispatcher,
        currentlyPlaying: track,
      })

      dispatcher.on('error', console.error)
      dispatcher.on("finish", playNext)
    }
  }

  const addTrack = async (track: Track): Promise<Message> => {
    const position = queue.tracks.push(track)

    if (!queue.currentlyPlaying) {
      playNext().catch(console.error)

      return embed({
        title: `Now playing`,
        description: `[${track.title}](${track.url})`,
        fields: [
          {
            name: 'Duration',
            value: `00:00 / ${track.duration}`,
          },
        ],
        thumbnail: {
          url: track.thumbnail,
        },
      } as MessageEmbed)
    } else {
      return embed({
        title: `Added to queue`,
        description: `[${track.title}](${track.url})`,
        fields: [
          {
            name: 'Position',
            value: `${position}`,
          },
          {
            name: 'Duration',
            value: `${track.duration}`,
          },
        ],
        
        thumbnail: {
          url: track.thumbnail,
        },
      } as MessageEmbed)
    }
  }

  return {
    connect,
    addTrack,
    playNext,
  }
}
