import { MessageEmbed, Message, StreamDispatcher } from "discord.js"
import { Track, Music } from "../@interfaces"
import { Queue } from "src/@interfaces/Queue"

export default ({ queue, embed }: { queue: Queue, embed(any): Promise<Message> }): Music => {
  const playNext = (): void => {
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

      const dispatcher: StreamDispatcher = queue.connection.play(track.url)

      Object.assign(queue, {
        dispatcher,
        currentlyPlaying: track,
      })

      // queue.dispatcher.on("error", console.error)
      // queue.dispatcher.on("close", console.log)
      // queue.dispatcher.on("debug", console.log)
      // queue.dispatcher.on("speaking", console.log)
    }
  }

  const addTrack = async (track: Track): Promise<Message> => {
    const days = Math.floor(track.rawDuration / 60 / 60 / 24)
    const hours = Math.floor(track.rawDuration / 60 / 60 - (days * 24))
    const minutes = Math.floor(track.rawDuration / 60 - (days * 60 * 24) - (hours * 60))
    const seconds = Math.floor(track.rawDuration - (days * 60 * 60 * 24) - (hours * 60 * 60) - (minutes * 60))
    
    const duration = [days || null, hours || days ? 0 : null, minutes, seconds]
      .filter(time => time !== null)
      .map(time => String(time).padStart(2, '0'))
      .join(':')

    track.duration = duration

    const position = queue.tracks.push(track)

    if (!queue.dispatcher) {
      playNext()

      return await embed({
        title: `Now playing`,
        description: `[${track.title}](${track.url})`,
        fields: [
          {
            name: 'Duration',
            value: `${track.duration}`,
          }
        ],
        image: {
          url: track.thumbnail
        },
      } as MessageEmbed)
    } else {
      return await embed({
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
          }
        ],
        
        image: {
          url: track.thumbnail
        },
      } as MessageEmbed)
    }
  }

  return {
    addTrack,
    playNext,
  }
}