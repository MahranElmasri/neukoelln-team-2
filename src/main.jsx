import React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthCotextProvider } from './context/AuthContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthCotextProvider>
      <App />
    </AuthCotextProvider>
  </React.StrictMode>
);
