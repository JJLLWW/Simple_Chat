import React, { useState } from 'react';
import {
  Avatar,
  Typography,
  Container,
} from '@mui/material';
import ChatBox from './ChatBox';
import ChatEntry from './ChatEntry';

// need some kind of lifecycle method to set the socket listener
function Chat(props) {
  // lift state for the component, all child components are implementation details
  let [Msg, SetMsg] = useState('');
  return (
    <Container>
      <Container align="center" sx={{ backgroundColor: '#ccc5c9' }}>
        <Avatar alt="Other User">A</Avatar>
      </Container>
      <ChatBox sock={props.sock} />
      <ChatEntry Msg={Msg} SetMsg={SetMsg} sock={props.sock} />
    </Container>
  );
}

function App(props) {
  return (
    <div>
      <Typography variant="h2" align="center">Chat App</Typography>
      <Chat sock={props.sock} />
    </div>
  );
}

export default App;
