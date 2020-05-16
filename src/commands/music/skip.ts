import { Command, MessageProps } from '../../@interfaces'

const skip: Command = {
  regex: /^skip(\s|$)/,

  callback ( props: MessageProps ) {
    if (props.member.voice.channel && props.member.voice.channel.id === props.queue.channel.id) {
      props.playNext()
    }
  }
}

export default skip
