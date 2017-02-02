import express from 'express'
import compression from 'compression'
import bodyParser from 'body-parser'

import config from 'config'
import render from 'server/render'
import schema from 'server/schema'
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'

const server = express()

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))

if (config.env === 'development') {
  require('./webpack').default(server)
}

if (config.env === 'production') {
  server.use(compression())
  server.use('/dist', express.static(config.distFolder))
}

server.use('/assets', express.static(config.assetsFolder))

server.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}))

server.use('/graphql', graphqlExpress(req => ({
  schema,
  context: req,
})))

server.use(render)

server.listen(config.port, 'localhost', err => {
  /* eslint-disable no-console */
  if (err) { return console.log(err) }
  console.log(`[APP] listening at localhost:${config.port} in ${config.env} mode`)
  /* eslint-enable no-console */
})
