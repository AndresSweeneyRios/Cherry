import { MessageProps, Command } from '../../@interfaces'

const ping: Command = {
  regex: /^ping(\s|$)/,
  callback (props: MessageProps) {
    props.send('Pong!')
  }
}

export default ping
