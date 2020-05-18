import { Command, MessageProps } from '../../@interfaces'
import { MessageEmbed } from 'discord.js'

const search: Command = {
  regex: /^(q|queue)(\s|$)/,

  callback ( props: MessageProps ) {
    const { currentlyPlaying, tracks } = props.queue

    if (!currentlyPlaying) props.quickEmbed(null, 'Nothing playing.')

    else{ 
      const fields = []

      fields.push({
        name: "Now playing",
        value: `${currentlyPlaying.title} - ${currentlyPlaying.duration}`
      })

      if (tracks.length > 0) fields.push({
        name: "Up next",
        value: tracks.map(
          ({ title, duration }, index) => `${index + 1}. ${title} - ${duration}`
        ).join('\n')
      })

      props.embed({ 
        description: fields.map(
          ({ name, value }) => `**${name}**\n\`\`\`\n${value}\n\`\`\``
        ).join('\n'),
        // image: {
        //   url: currentlyPlaying.thumbnail,
        // },
      } as MessageEmbed)
    }
  }
}

export default search
