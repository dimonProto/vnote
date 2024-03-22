import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import './styles/index.scss'
import { store } from './store'
import App from './containers/App'
import { createRoot } from 'react-dom/client'

const container = document.getElementById('root')
const root = createRoot(container) // createRoot(container!) if you use TypeScript


root.render(
  <Router>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>,
)