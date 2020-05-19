import { Command, MessageProps } from '../../@interfaces'
import { MessageEmbed } from 'discord.js'

import { escape } from '../../utils/markdown'

const search: Command = {
  regex: /^(q|queue|list)(\s|$)/i,

  usage: 'queue | q | list',
  description: 'Displays server queue.',

  callback ( props: MessageProps ) {
    const { currentlyPlaying, tracks } = props.queue

    if (!currentlyPlaying) props.quickEmbed(null, 'Nothing playing.')

    else{ 
      const fields = []

      fields.push({
        name: "Now playing",
        value: `[${escape(currentlyPlaying.title)}](${currentlyPlaying.url}) - ${currentlyPlaying.duration}\n Requested by <@${currentlyPlaying.author.id}>`
      })

      if (tracks.length > 0) fields.push({
        name: "Up next",
        value: tracks.map(
          ({ title, duration, url, author }, index) => (
            `${index + 1}. [${escape(title)}](${url}) - ${duration}\n Requested by <@${author.id}>`
          )
        ).join('\n\n')
      })

      props.embed({ 
        description: fields.map(
          ({ name, value }) => `**${name}**\n${value}`
        ).join('\n\n'),
        // image: {
        //   url: currentlyPlaying.thumbnail,
        // },
        author: null,
      } as MessageEmbed)
    }
  }
}

export default search
