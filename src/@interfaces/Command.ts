import { MessageProps } from './MessageProps'

export interface Command {
  name?: string
  description?: string
  regex: RegExp
  noPrefix?: boolean
  callback (props?: MessageProps): Promise<void> | void
}
