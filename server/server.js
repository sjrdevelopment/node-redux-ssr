import path from 'path'
import Express from 'express'
import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'

import Main from '../src/components/main.js'
import rootReducer from '../src/reducers/rootReducer.js'

const app = Express()
const port = 3000

const getLast2Weeks = () => {
  const dateRange = Array(14)
    .fill()
    .map((item, index) => {
      const date = new Date()
      date.setDate(date.getDate() - index - 1)

      return {
        date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
        completed: true,
      }
    })

  return dateRange.reverse()
}

const handleRender = (req, res) => {
  console.log('handling request...')
  const store = createStore(rootReducer)

  const html = renderToString(
    <Provider store={store}>
      <Main />
    </Provider>
  )

  const preloadedState = {
    ...store.getState(),
    trackerData: {
      items: [
        {
          name: 'server item 1',
          history: getLast2Weeks(),
        },
        {
          name: 'server item 2',
          history: getLast2Weeks(),
        },
        {
          name: 'server item 3',
          history: getLast2Weeks(),
        },
      ],
    },
  }

  res.send(renderFullPage(html, preloadedState))
}

const renderFullPage = (html, preloadedState) => {
  return `
    <!doctype html>
    <html>
      <head>
        <link rel="stylesheet" type="text/css" href="/main.css"></link>
        <title>Node Redux SSR template</title>
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(
            /</g,
            '\\u003c'
          )}
        </script>
        <script src="/client-bundle.js"></script>
      </body>
    </html>
  `
}

console.log(`Starting server in ... ${path.join(__dirname)}`)

app.use(Express.static(path.join(__dirname)))
app.use(handleRender)
app.listen(port)

console.log(`Listening on port ${port}`)
