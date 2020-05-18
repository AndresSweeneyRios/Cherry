import { Command, MessageProps, Track } from '../../@interfaces'
import { MessageEmbed } from 'discord.js'

const search: Command = {
  regex: /^search\s.+|^(p|play)\s(?=.+)(?!https?:\/\/.+)/,
  
  async callback ( props: MessageProps ) {
    const query = props.args.join(' ')

    const search = await props.youtube.search.list({
      q: query,
      type: 'video',
      part: 'id',
      maxResults: 10,
    })

    const idList = search.data.items.map(({ id }) => id.videoId)

    const videos = await props.youtube.videos.list({
      id: idList.join(','),
      part: 'snippet,contentDetails'
    })

    const { items } = videos.data

    const tracks: Track[] = items.map(
      ({ id, snippet, contentDetails }) => {
        const ptDuration = contentDetails.duration.replace('PT', '')

        const [days] = ptDuration.match(/([0-9]{1,2}(?=D))/) || [null]
        const [hours] = ptDuration.match(/([0-9]{1,2}(?=H))/) || [days ? '0' : null]
        const [minutes] = ptDuration.match(/([0-9]{1,2}(?=M))/) || ['0']
        const [seconds] = ptDuration.match(/([0-9]{1,2}(?=S))/) || ['0']
        
        const parsedPtDuration = [seconds, minutes, hours, days]
          .filter(value => value !== null)

        const duration = parsedPtDuration
          .reverse()
          .map(string => string.padStart(2, '0'))
          .join(':')

        const rawDuration = parsedPtDuration
          .map(Number)
          .reduce((acc, number, index) => {
            const multipliers = [1, 60, 60 * 60, 60 * 60 * 24] /* second, minute, hour, day */
            acc += number * multipliers[index]

            return acc 
          }, 0)

        return {
          title: snippet.title,
          description: snippet.description,
          duration,
          rawDuration,
          thumbnail: snippet.thumbnails.high.url,
          author: props.author,
          url: `https://www.youtube.com/watch?v=${id}`,
        }
      }
    )

    Object.assign(props.search, {
      tracks,
      date: Date.now()
    })

    const mappedTracks = tracks.map(
      ({ title, duration }, index) => `${index+1}. ${title} - ${duration}`
    ).join('\n\n')

    await props.quickEmbed(
      `Results for \`${query}\``, 
      `\`\`\`\n${mappedTracks}\n\`\`\`\nType 1-10 to select a song.`,
    )
  }
}

export default search
