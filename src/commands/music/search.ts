import { Command, MessageProps } from '../../@interfaces'

import ytdl from '../../ytdl'

const search: Command = {
  regex: /^search(\s|$)/,
  
  callback ( props: MessageProps ) {
    
  }
}

export default search
