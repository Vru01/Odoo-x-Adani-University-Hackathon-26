import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App' // or ./App.jsx
import './index.css'

// Providers
import { AuthProvider } from './context/AuthContext' 
import { GoogleOAuthProvider } from '@react-oauth/google'

// REPLACE THIS STRING WITH YOUR ACTUAL GOOGLE CLIENT ID
const GOOGLE_CLIENT_ID = "YOUR_ACTUAL_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)