import { Command, MessageProps } from '../../@interfaces'

const skip: Command = {
  regex: /^(s|skip)$/,

  async callback ( props: MessageProps ) {
    const { currentlyPlaying } = props.queue

    if ( currentlyPlaying ) {
      await props.quickEmbed('Skipping track', props.queue.currentlyPlaying.title)
      // await props.music.playNext()
      props.queue.dispatcher.emit("finish")
    } else {
      await props.quickEmbed(null, 'Nothing playing.')
    }
  }
}

export default skip
