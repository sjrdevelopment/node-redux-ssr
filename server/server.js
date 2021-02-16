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

  /* TODO:

    1. Connect to remote DynamoDB
    2. Populate DB with records
      2.1 Table for habits
      2.2 Table for date based records, datetime format
      2.3 Authentication details
    3. Pull in habit names
    4. Pull in last 2 weeks' dates
    5. Format data for display

    Next: interaction for adding/removing habits
  */
  const preloadedState = {
    ...store.getState(),
    pageData: {
      items: [
        {
          name: 'Running',
          history: getLast2Weeks(),
        },
        {
          name: 'Reading',
          history: getLast2Weeks(),
        },
        {
          name: 'Projects',
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
