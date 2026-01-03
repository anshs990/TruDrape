// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import { GoogleOAuthProvider } from '@react-oauth/google';

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )


// ReactDOM.createRoot(document.getElementById('root')).render(
//   <GoogleOAuthProvider clientId="">
//     <App />
//   </GoogleOAuthProvider>
// );

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

// Create the root once and render everything inside it
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="1076584517332-g2bv9uc8hauqh1p8us4836k85evt7ml6.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);