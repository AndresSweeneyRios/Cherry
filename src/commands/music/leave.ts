import { Command, MessageProps } from '../../@interfaces'

const leave: Command = {
  regex: /^(leave|fuckoff|goaway|bye)$/i,

  usage: 'leave',
  description: 'Disconnects from the voice channel',

  async callback ( props: MessageProps ) {
    if (props.queue.connection) await props.queue.connection.disconnect()
  }
}

export default leave
