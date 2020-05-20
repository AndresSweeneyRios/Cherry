import {
  Command, 
  MessageProps, 
  Track, 
} from '../../@interfaces'

import ytdl from '../../utils/ytdl'

import { durationFromSeconds } from '../../utils/duration'

const play: Command = {
  regex: /^(p|play)\s(https?:\/\/.+)/i,

  usage: 'play | p <url>',
  description: 'Adds a track to queue from a URL. ([Supported sites](https://ytdl-org.github.io/youtube-dl/supportedsites.html))',

  async callback (props: MessageProps): Promise<void> {
    const [url, urlType] = props.args

    // if (!url || !/^https?:\/\/.+/.test(url) && urlType !== 'file') {
    //   await props.quickEmbed(null, 'Please provide a valid URL.', red)
    //   return 
    // }

    const connection = await props.music.connect()

    if (!connection) return

    if (/\.(mp3|ogg|wav|aiff|m4a)$/.test(url) || /raw|file/.test(urlType)) {
      const track: Track = {
        title: /[^\/]+((?=\#|\?)|$)/.exec(url)[0].replace(/(\?|\#).+/, ''),
        duration: '00:00',
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

    const isYoutube = /youtube.com|youtu.be/.test(url)

    const source = isYoutube ? url : formats.find(({ format }) => /audio only/.test(format)).url

    const duration = durationFromSeconds(rawDuration)

    const track: Track = {
      title,
      duration,
      rawDuration,
      description,
      author: props.author,
      url: source,
      thumbnail: thumbnails && thumbnails.reverse()[0].url,
    }

    await props.music.addTrack(track)
  },
}

export default play
