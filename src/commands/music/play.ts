import { Command, MessageProps, Track } from '../../@interfaces'

import ytdl from '../../ytdl'

const play: Command = {
  regex: /^play(\s|$)/,

  async callback ( props: MessageProps ): Promise<void> {
    const [ url ] = props.args

    const channel = props.member.voice.channel

    if (!channel) {
      await props.quickEmbed('You must join a voice channel first.')
      return
    }

    if (!url || !/^https?:\/\/.+/.test(url)) {
      await props.quickEmbed('Please provide a valid URL.')
      return 
    }

    const connection = await channel.join()

    const queue = props.queue

    queue.connection = connection
    queue.channel = channel

    connection.on("disconnect", () => {
      queue.connection = null
      queue.channel = null
    })

    const result: string = await ytdl(['-J', '-q', '-s', '-f', 'bestaudio', url])

    // console.log(JSON.parse(result))

    const {
      title,
      duration,
      thumbnails,
      formats,
    }: {
      title: string,

      duration: number,

      thumbnails: [{
        url: string
      }]

      formats: [{
        ext: string
        url: string
        acodec: string
        format: string
      }]
    } = JSON.parse(result)

    const track: Track = {
      title,
      duration,
      url: formats.find(({ format }) => /audio only/.test(format)).url,
      thumbnail: thumbnails && thumbnails.reverse()[0].url,
    }

    props.send(track.thumbnail)

    props.addTrack(track)
  }
}

export default play
