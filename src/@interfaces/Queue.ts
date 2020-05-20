import {
  VoiceConnection, 
  VoiceChannel, 
  StreamDispatcher, 
} from 'discord.js'

import { Track } from './Track'

export interface Queue {
  connection?: VoiceConnection
  channel?: VoiceChannel
  dispatcher?: StreamDispatcher
  currentlyPlaying: Track | null
  tracks: Track[]
}
