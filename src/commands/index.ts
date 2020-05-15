import config from '../config'

import { MessageProps } from '../@interfaces'

import utils from './utils'

export const commands = [
  ...utils,
]

export const testCommand = async ( props: MessageProps ) => {
  const hasPrefix = config.prefix.test(props.content)

  for (const { 
    regex, 
    callback, 
    noPrefix,
  } of commands) {
    if (!noPrefix && !hasPrefix) continue

    const unprefixedContent = noPrefix
      ? props.content
      : props.content.replace(config.prefix, '')

    if (regex.test(unprefixedContent)) return await callback(props)
  }
}
