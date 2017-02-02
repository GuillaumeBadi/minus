import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'

import reducer from 'reducers'
import devTools from 'middlewares/dev-tools'

export default (history, client, initialState) => {

  const routing = routerMiddleware(history)

  const enhancers = compose(
    applyMiddleware(thunk, routing, client.middleware()),
    devTools
  )

  const store = createStore(reducer(client), initialState, enhancers)

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers').default(client)
      store.replaceReducer(nextRootReducer)
    })
  }

  return store

}
