import { VoiceState } from 'discord.js'

import { Props } from '../@interfaces'

const voiceStateHandler = (props: Props) => async (voiceState: VoiceState): Promise<void> => {
  const { queues } = props
  const guildID = voiceState.guild.id

  if (queues[guildID] && queues[guildID].connection) {
    const queue = queues[guildID]
    
    if (queue.channel.members.size === 1) {
      await queue.connection.disconnect()
    }
  }
}

export default voiceStateHandler
