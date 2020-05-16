import { Command, MessageProps } from '../../@interfaces'

const search: Command = {
  regex: /^queue(\s|$)/,

  callback ( props: MessageProps ) {
    console.log(props.queue)
  }
}

export default search
