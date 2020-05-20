import { MessageProps, Command } from '../../@interfaces'

const refreshListeners: Command = {
  regex: /^refresh(\s|$)/,
  async callback (props: MessageProps) {
    await props.refreshListeners()
    await props.quickEmbed(null, 'Refreshed event listeners.')
  }
}

export default refreshListeners
