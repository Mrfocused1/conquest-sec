import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { CmsProvider } from './store/cms'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CmsProvider>
      <App />
    </CmsProvider>
  </React.StrictMode>,
)
