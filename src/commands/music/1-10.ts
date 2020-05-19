import { Command, MessageProps } from '../../@interfaces'

const selectOneToTen: Command = {
  regex: /^(10|[1-9])$/i,

  noPrefix: true,

  async callback ( props: MessageProps ) {
    if (!props.search.date || Date.now() - props.search.date > 30000) return

    const connection = await props.music.connect()

    if (!connection) return

    const selection = Number(props.content) - 1

    const track = props.search.tracks[selection]

    if (!track) return

    Object.assign(props.search, {
      tracks: [],
      date: 0,
    })

    await props.music.addTrack(track)
  }
}

export default selectOneToTen
