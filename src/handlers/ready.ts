import { Props } from '../@interfaces'

const readyHandler = (props: Props) => (): void => {
  const { client } = props
  console.log(`Logged in as ${client.user.tag}!`)
}

export default readyHandler
