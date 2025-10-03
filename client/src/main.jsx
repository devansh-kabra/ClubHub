// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';

import './index.css'
import App from './App.jsx';
import { BrowserRouter } from 'react-router'
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { GoogleOAuthProvider } from '@react-oauth/google';

const queryClient = new QueryClient();
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENTID;

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId} googleAccountOptions={{prompt_mode: "none"}}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  // </StrictMode>,
)
