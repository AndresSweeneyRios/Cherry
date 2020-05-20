import {
  MessageProps, 
  Command, 
} from '../../@interfaces'

import { commands } from '../'

const ping: Command = {
  regex: /^(help|ayuda)$/,
  
  async callback (props: MessageProps) {
    const commandList = commands
      .filter(({ usage, description }) => usage && description)
      .map(
        ({ usage, description }) => `\`${usage}\` - ${description}`,
      )
      .join('\n')

    await props.quickEmbed(
      null, 
      commandList +
      `\n\n[Invite Cherry](https://discord.com/api/oauth2/authorize?client_id=443491966576230400&permissions=0&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fdiscord%2Fauth&scope=bot)` +
      `\n[Fork on GitHub](https://github.com/Andr3wRiv3rs/Cherry)`,
    )
  },
}

export default ping
