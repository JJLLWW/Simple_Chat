import React, { useState } from 'react';
import {
  Avatar,
  Typography,
  TextField,
  Box,
  List,
  ListItem,
  Stack,
  Container,
} from '@mui/material';

function Message(props) {
  return (
    <Stack align="left" direction="row" alignItems="center" gap="10px">
      <Avatar>{props.senderID}</Avatar>
      <Typography>{props.text}</Typography>
    </Stack>
  );
}

// ChatBox is a class component as needs to listen on the socket exactly once.
class ChatBox extends React.Component {
  constructor(props) {
    super(props);
    // we should initialise the state from the server.
    this.state = { Msgs: [] };
    // yuck, necessary for ES6 classes to make this available to non-react methods
    this.MsgListener = this.MsgListener.bind(this);
    this.RenderMsg = this.RenderMsg.bind(this);
  }

  // we need this cleanup as the component tree is rendered twice in dev mode for some reason.
  componentDidMount() {
    this.props.sock.on('serv_msg', this.MsgListener);
  }

  componentWillUnmount() {
    this.props.sock.off('serv_msg', this.MsgListener);
  }

  MsgListener(msg) {
    this.setState((state, props) => {
      // hacked out, copy from state to avoid double push
      let NewMsgs = [...state.Msgs];
      NewMsgs.push(msg);
      return {
        Msgs: NewMsgs,
      };
    });
  }

  RenderMsg(i) {
    return (
      <ListItem key={i}>
        <Message text={this.state.Msgs[i].text} senderID={this.state.Msgs[i].senderID} />
      </ListItem>
    );
  }

  // what if the state of all messages is modified mid render?
  RenderMsgs(N) {
    const output = [];
    for (let i = 0; i < N; i += 1) {
      output.push(this.RenderMsg(i));
    }
    return output;
  }

  render() {
    return (
      <Box sx={{ overflow: 'auto' }} height="50vh">
        <List>
          {this.RenderMsgs(this.state.Msgs.length)}
        </List>
      </Box>
    );
  }
}

// it's ok to put the helper in the function component as this component is only used once,
// so won't keep re-initialising.
function ChatEntry(props) {
  let { Msg } = props;
  const { SetMsg } = props;
  function KeyHandler(ev, sock) {
    if (ev.key === 'Backspace') {
      if (Msg.length <= 1) {
        SetMsg('');
      } else {
        SetMsg(Msg.slice(0, Msg.length - 1));
      }
    }
    // try and just handle normal input, not control codes
    else if (ev.key.length === 1) {
      SetMsg(Msg += ev.key);
    } else if (ev.key === 'Enter') {
      sock.emit('client_msg', { text: Msg, senderID: null });
      SetMsg('');
    }
  }
  return (
    <TextField sx={{ width: '100%' }} label="New Message" value={Msg} onKeyDown={(ev) => { KeyHandler(ev, props.sock); }} />
  );
}

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
