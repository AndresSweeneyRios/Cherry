import { Message, MessageEmbed } from 'discord.js'

export interface MessageProps extends Message {
  send (content: string | MessageEmbed): Promise<Message>
  embed (options: MessageEmbed): Promise<Message>
}
