import { Command, MessageProps } from '../../@interfaces'
import { MessageEmbed } from 'discord.js'
import { durationFromSeconds } from '../../utils/duration'
import { escape } from '../../utils/markdown'

const nowplaying: Command = {
  regex: /^(nowplaying|np|playing|status)$/i,

  async callback ( props: MessageProps ) {
    const { currentlyPlaying, dispatcher } = props.queue

    if (!currentlyPlaying) props.quickEmbed(null, 'Nothing playing.')

    else{
      await props.embed({ 
        title: 'Now playing',
        description: `[${escape(currentlyPlaying.title)}](${currentlyPlaying.url})`,
        fields: [
          {
            name: 'Duration',
            value: `${durationFromSeconds(dispatcher.streamTime/1000)} / ${currentlyPlaying.duration}`,
          },
          {
            name: 'Requested by',
            value: `<@${currentlyPlaying.author.id}>`
          },
        ],
        thumbnail: {
          url: currentlyPlaying.thumbnail,
        },
      } as MessageEmbed)
    }
  }
}

export default nowplaying
