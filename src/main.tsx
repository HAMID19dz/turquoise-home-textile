import React from 'react';
import ReactDOM from 'react-dom/client';

// Polyfill React.use for React 18 compatibility with modern motion libraries (@animate-ui/react)
if (typeof (React as unknown as { use?: unknown }).use !== 'function') {
  (React as unknown as { use: typeof React.useContext }).use = React.useContext;
}

import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
