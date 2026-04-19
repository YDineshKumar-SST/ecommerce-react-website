import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider, WishlistProvider, ThemeProvider } from './components/Context'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <CartProvider>
          <WishlistProvider>
            <App />
          </WishlistProvider>
        </CartProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
