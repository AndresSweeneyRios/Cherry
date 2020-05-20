# Cherry

## prerequisites
- yarn
- node.js

## setup
Create `/src/config.ts` with the following contents
```ts
import { Config } from './@interfaces'

const config: Config = {
  token: '<bot_token>',
  prefix: /^\$/,
  devServer: '<dev_guild_id>', // only executes commands here in dev mode
}

export default config
```

and start the project like so
```
yarn
yarn dev
```

production setup requires you to build the bot first
```
yarn build
yarn start
```

## scripts
```ts
{
  build         // builds the project to /dist for production mode
  start         // starts the bot in production mode
  dev           // starts the bot in development mode
  devProduction // starts the bot in production mode, and uses config.devServer
  lint          // lints and fixes
}
```

This project is licensed under MIT.
