import { Command, MessageProps, Track } from '../../@interfaces'

import ytdl from '../../ytdl'
import { red } from '../../colors'

const play: Command = {
  regex: /^play(\s|$)/,

  async callback ( props: MessageProps ): Promise<void> {
    const [ url, urlType ] = props.args

    const channel = props.member.voice.channel

    if (!channel) {
      await props.quickEmbed(null, 'You must join a voice channel first.', red)
      return
    }

    if (!url || !/^https?:\/\/.+/.test(url) && urlType !== 'file') {
      await props.quickEmbed(null, 'Please provide a valid URL.', red)
      return 
    }

    const connection = await channel.join()

    connection.on("error", console.error)
    connection.on("debug", console.log)

    const queue = props.queue

    queue.connection = connection
    queue.channel = channel

    connection.on("disconnect", () => {
      queue.connection = null
      queue.channel = null
    })

    if (/\.(mp3|ogg|wav|aiff|m4a)$/.test(url) || /raw|file/.test(urlType)) {
      const track: Track = {
        title: /[^\/]+((?=\#|\?)|$)/.exec(url)[0].replace(/(\?|\#).+/, ''),
        rawDuration: 0,
        description: '',
        author: props.author,
        url,
        thumbnail: null,
      }
  
      await props.music.addTrack(track)
      return
    }

    const result: string = await ytdl(['-J', '-q', '-s', '-f', 'bestaudio', url])

    const {
      title,
      description,
      duration: rawDuration,
      thumbnails,
      formats,
    }: {
      title: string

      description: string

      duration: number

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

    console.log(formats.find(({ format }) => /audio only/.test(format)))

    const track: Track = {
      title,
      rawDuration,
      description,
      author: props.author,
      url: /youtube.com|youtu.be/.test(url) ? url : formats.find(({ format }) => /audio only/.test(format)).url,
      thumbnail: thumbnails && thumbnails.reverse()[0].url,
    }

    await props.music.addTrack(track)
  }
}

export default play
