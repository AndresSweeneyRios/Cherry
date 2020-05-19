import { Command, MessageProps, Track } from '../../@interfaces'

import { arrayFromPTString, durationFromPTStringArray, secondsFromPTStringArray } from '../../utils/duration'

import axios from 'axios'

const search: Command = {
  regex: /^search\s.+|^(p|play)\s(?=.+)(?!https?:\/\/.+)/,
  
  async callback ( props: MessageProps ) {
    const connection = await props.music.connect()

    if (!connection) return

    const query = props.args.join(' ')

    // const search = await props.youtube.search.list({
    //   q: query,
    //   type: 'video',
    //   part: 'id',
    //   maxResults: 10,
    // })

    // const idList = search.data.items.map(({ id }) => id.videoId)

    // const videos = await props.youtube.videos.list({
    //   id: idList.join(','),
    //   part: 'snippet,contentDetails'
    // })

    // const { items } = videos.data

    // if (items.length === 0) {
    //   await props.quickEmbed(null, 'No results.')
    //   return
    // }

    // const tracks: Track[] = items.map(
    //   ({ id, snippet, contentDetails }) => {
    //     const parsedPtString = arrayFromPTString(contentDetails.duration)
    //     const duration = durationFromPTStringArray(parsedPtString)
    //     const rawDuration = secondsFromPTStringArray(parsedPtString)

    //     const { high, maxres } = snippet.thumbnails

    //     return {
    //       title: snippet.title,
    //       description: snippet.description,
    //       duration,
    //       rawDuration,
    //       thumbnail: (maxres || high).url,
    //       author: props.author,
    //       url: `https://www.youtube.com/watch?v=${id}`,
    //     }
    //   }
    // )

    const { data } = await axios.get(`http://youtube-scrape.herokuapp.com/api/search?q=${query}`)

    const { results: items } = data
    
    if (items.length === 0) {
      await props.quickEmbed(null, 'No results.')
      return
    }

    const tracks: Track[] = items.slice(0, 10).map(
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
          title,
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
      ({ title, duration }, index) => `${index+1}. ${title} - ${duration}`
    ).join('\n\n')

    console.log(mappedTracks)

    await props.quickEmbed(
      `Results for \`${query}\``, 
      `\`\`\`\n${mappedTracks}\n\`\`\`\nType 1-10 to select a song.`,
    )
  }
}

export default search
