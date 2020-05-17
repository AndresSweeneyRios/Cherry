import { Command, MessageProps } from '../../@interfaces'

const search: Command = {
  regex: /^q|queue(\s|$)/,

  callback ( props: MessageProps ) {
    console.log(props.queue)
  }
}

export default search
