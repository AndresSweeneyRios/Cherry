import {
  Command, 
  MessageProps, 
} from '../../@interfaces'

const skip: Command = {
  regex: /^(s|skip)$/i,

  usage: 'skip | s',
  description: 'Skips a song.',

  async callback (props: MessageProps) {
    const { currentlyPlaying } = props.queue

    if (currentlyPlaying) {
      await props.quickEmbed(
        'Skipping track', 
        `[${currentlyPlaying.title}](${currentlyPlaying.url}) - ${currentlyPlaying.duration}\n Requested by <@${currentlyPlaying.author.id}>`,
      )
      // await props.music.playNext()
      props.queue.dispatcher.emit("finish")
    } else {
      await props.quickEmbed(null, 'Nothing playing.')
    }
  },
}

export default skip
