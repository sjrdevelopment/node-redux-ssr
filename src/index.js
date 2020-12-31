import React from 'react'
import { hydrate } from 'react-dom'

import Main from './components/main.js'

import { Provider } from 'react-redux'
import configureStore from './store'

hydrate(
  <Provider store={configureStore()}>
    <Main />
  </Provider>,
  document.getElementById('root')
)
