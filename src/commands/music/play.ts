import { Command, MessageProps, Track } from '../../@interfaces'

import ytdl from '../../ytdl'
// import { red } from '../../colors'

const play: Command = {
  regex: /^(p|play)\s(https?:\/\/.+)/,

  async callback ( props: MessageProps ): Promise<void> {
    const [ url, urlType ] = props.args

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

    const days = Math.floor(rawDuration / 60 / 60 / 24)
    const hours = Math.floor(rawDuration / 60 / 60 - (days * 24))
    const minutes = Math.floor(rawDuration / 60 - (days * 60 * 24) - (hours * 60))
    const seconds = Math.floor(rawDuration - (days * 60 * 60 * 24) - (hours * 60 * 60) - (minutes * 60))
    
    const duration = [days || null, hours || days ? 0 : null, minutes, seconds]
      .filter(time => time !== null)
      .map(time => String(time).padStart(2, '0'))
      .join(':')

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
  }
}

export default play
