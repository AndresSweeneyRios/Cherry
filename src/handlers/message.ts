import { MessageEmbed, Message } from 'discord.js'

import { testCommand } from '../commands'
import { pink } from '../colors'

import { Props, MessageProps } from '../@interfaces'

const messageHandler = (props: Props) => async ( message: Message ): Promise<void> => {
  const send = (content: string | MessageEmbed): Promise<Message> => {
    return message.channel.send(content)
  }

  const embed = ( options: MessageEmbed ): Promise<Message> => {
    const embed = {
      author: { 
        icon_url: message.author.avatarURL, 
        name: message.author.username,
      },
      timestamp: new Date(),
      color: pink,
      ...options
    } as MessageEmbed

    return send(embed)
  }

  const messageProps = {
    ...message,
    send,
    embed,
  } as MessageProps

  testCommand(messageProps)
}

export default messageHandler
