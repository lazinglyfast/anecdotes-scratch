import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { NotificationContextProvider } from "./NotificationContext.jsx"

const client = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <NotificationContextProvider>
    <QueryClientProvider client={client}>
      <App />
    </QueryClientProvider>
  </NotificationContextProvider>
)
