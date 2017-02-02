import React from 'react'
import { render } from 'react-dom'
import { syncHistoryWithStore } from 'react-router-redux'
import { trigger } from 'redial'
import { Provider } from 'react-redux'
import ApolloClient, { createBatchingNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { Router, browserHistory, match } from 'react-router'

import createStore from 'store'
import routes from 'routes'

import 'styles/main.scss'

const networkInterface = createBatchingNetworkInterface({
  uri: '/graphql',
  batchInterval: 100,
  opts: {
    credentials: 'same-origin',
  },
})

export const client = new ApolloClient({
  dataIdFromObject: o => o.id,
  initialState: window.__INITIAL_STATE__,
  shouldBatch: true,
  networkInterface,
})

const store = createStore(browserHistory, client, window.__INITIAL_STATE__)
const history = syncHistoryWithStore(browserHistory, store)

const matchRoutes = location =>
  match({ routes, location }, (error, redirectLocation, renderProps) => {

    if (redirectLocation) { return matchRoutes(redirectLocation) }

    const locals = {
      path: renderProps.location.pathname,
      query: renderProps.location.query,
      params: renderProps.params,
      dispatch: store.dispatch,
    }

    const { components } = renderProps

    if (window.__INITIAL_STATE__) {
      delete window.__INITIAL_STATE__
    } else {
      trigger('fetch', components, locals)
    }

  })

history.listen(matchRoutes)

const root = (
  <ApolloProvider store={store} client={client}>
    <Router history={history} routes={routes} />
  </ApolloProvider>
)

const rootNode = document.getElementById('root')

render(root, rootNode)
