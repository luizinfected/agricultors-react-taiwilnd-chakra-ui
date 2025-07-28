import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { ToastContainer } from 'react-toastify'

import 'remixicon/fonts/remixicon.css';
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ChakraProvider>
        <ToastContainer />
        <App />
      </ChakraProvider>
  </StrictMode>,
)
