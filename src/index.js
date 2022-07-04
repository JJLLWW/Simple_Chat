import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import io from 'socket.io-client';
import CssBaseline from '@mui/material/CssBaseline';

import {
  ThemeProvider,
  createTheme,
} from '@mui/material/styles';
import App from './components/App';

const DarkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

// stupid way to share the socket on browser
const socket = io('ws://localhost:3000');
socket.emit('get_msg');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={DarkTheme}>
      <CssBaseline />
      <App sock={socket} />
    </ThemeProvider>
  </React.StrictMode>,
);
