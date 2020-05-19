import { MessageProps, Command } from '../../@interfaces'

import { commands } from '../'

const ping: Command = {
  regex: /^(help|ayuda)$/,
  
  async callback (props: MessageProps) {
    await props.quickEmbed(
      null, 
      commands
        .filter(({ usage, description }) => usage && description)
        .map(
          ({ usage, description }) => `\`${usage}\` - ${description}`
        ).join('\n')
    )
  }
}

export default ping
