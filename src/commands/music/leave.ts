import { Command, MessageProps } from '../../@interfaces'

const leave: Command = {
  regex: /^(leave|fuckoff|goaway|bye)$/,

  async callback ( props: MessageProps ) {
    if (props.queue.connection) await props.queue.connection.disconnect()
  }
}

export default leave
