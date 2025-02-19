import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "@appwrite.io/pink";
import "@appwrite.io/pink-icons";
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
