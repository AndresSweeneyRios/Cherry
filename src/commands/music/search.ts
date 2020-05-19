import { Command, MessageProps, Track } from '../../@interfaces'

import { durationFromPTStringArray, secondsFromPTStringArray } from '../../utils/duration'

import { escape } from '../../utils/markdown'

import axios from 'axios'

const search: Command = {
  regex: /^search\s.+|^(p|play)\s(?=.+)(?!https?:\/\/.+)/i,
  
  async callback ( props: MessageProps ) {
    const connection = await props.music.connect()

    if (!connection) return

    const query = props.args.join(' ')

    const { data } = await axios.get(`http://youtube-scrape.herokuapp.com/api/search?q=${query}`)

    const { results: items } = data
    
    if (items.length === 0) {
      await props.quickEmbed(null, 'No results.')
      return
    }

    const tracks: Track[] = items
      .filter(({ video: { duration } }) => duration.toLowerCase() !== 'playlist')
      .slice(0, 10)
      .map(
        ({ video: { 
          snippet: description, 
          title, 
          url, 
          thumbnail_src: thumbnail, 
          duration: durationString, 
        }}) => {
          const parsedPtString = durationString.split(':').reverse()
          const duration = durationFromPTStringArray(parsedPtString)
          const rawDuration = secondsFromPTStringArray(parsedPtString)

          return {
            title: escape(title),
            description,
            duration,
            rawDuration,
            thumbnail,
            author: props.author,
            url,
          }
        }
      )

    Object.assign(props.search, {
      tracks,
      date: Date.now()
    })

    const mappedTracks = tracks.map(
      ({ title, duration, url }, index) => `${index+1}. [${title}](${url}) - ${duration}`
    ).join('\n\n')

    await props.quickEmbed(
      `Results for *${escape(query)}*`, 
      `${mappedTracks}\n\nType 1-10 to select a song.`,
    )
  }
}

export default search
