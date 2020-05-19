import { VoiceState } from 'discord.js'

import { Props } from '../@interfaces'

const voiceStateHandler = (props: Props) => async (vc: VoiceState) => {
  const { client, queues } = props
  const guildID = vc.guild.id;

  if (queues[guildID] && queues[guildID].connection) {
    let queue = queues[guildID];
    
    if (queue.channel.members.size == 1) {
      await queue.connection.disconnect()
    }
  }
}

export default voiceStateHandler
