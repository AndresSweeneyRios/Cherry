import {
  Command, 
  MessageProps, 
} from '../../@interfaces'

const pause: Command = {
  regex: /^(pause|stop)$/i,

  usage: 'pause | stop',
  description: 'Pauses playback.',

  async callback (props: MessageProps) {
    const { dispatcher } = props.queue

    if (!dispatcher.paused) {
      dispatcher.pause(true)
      await props.quickEmbed(null, 'Pausing playback.')
    }
  },
}

export default pause
