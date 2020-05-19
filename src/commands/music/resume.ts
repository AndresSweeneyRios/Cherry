import { Command, MessageProps } from '../../@interfaces'

const resume: Command = {
  regex: /^(resume|play|unpause)$/i,

  async callback ( props: MessageProps ) {
    const { dispatcher } = props.queue

    if (dispatcher.paused) {
      dispatcher.resume()
      await props.quickEmbed(null, 'Resuming playback.')
    }
  }
}

export default resume
