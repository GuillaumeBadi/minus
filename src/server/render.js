import path from 'path'
import React from 'react'
import { trigger } from 'redial'
import { Router, match, createMemoryHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import promisify from 'es6-promisify'
import ApolloClient from 'apollo-client'
import { ApolloProvider } from 'react-apollo'

import config from 'config'
import routes from 'routes'
import createStore from 'store'

import Html from 'components/Html'

const stats = (config.env === 'production')
  ? require(path.join(config.distFolder, 'stats.json'))
  : {}

const matchRoutes = promisify(match, { multiArgs: true })

async function render (req, res) {
  try {

    const { url } = req
    const memHistory = createMemoryHistory(url)
    const location = memHistory.createLocation(url)
    const client = new ApolloClient()

    const store = createStore(memHistory, client, {})
    const history = syncHistoryWithStore(memHistory, store)

    const [redirectLocation, renderProps] = await matchRoutes({ routes, location })

    if (redirectLocation) { return res.redirect(redirectLocation.pathname) }
    if (!renderProps) { return res.status(404).end('not found') }

    const { dispatch } = store

    const locals = {
      path: renderProps.location.pathname,
      query: renderProps.location.query,
      params: renderProps.params,
      dispatch,
    }

    const { components } = renderProps

    await trigger('fetch', components, locals)

    const root = (
      <ApolloProvider store={store} client={client}>
        <Router history={history} routes={routes} />
      </ApolloProvider>
    )

    const markup = renderToStaticMarkup(
      <Html
        stats={stats}
        state={store.getState()}
        content={renderToString(root)}
      />
    )

    const page = `<!doctype html>${markup}`

    res.end(page)

  } catch (err) { res.status(500).send(err.stack) }
}

export default render
