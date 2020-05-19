import { MessageProps } from './MessageProps'

export interface Command {
  usage?: string
  description?: string
  regex: RegExp
  noPrefix?: boolean
  callback (props?: MessageProps): Promise<void> | void
}
