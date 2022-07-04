import React from 'react';
import {
  Box,
  List,
  ListItem,
} from '@mui/material';
import Message from './Message';

// ChatBox is a class component as needs to listen on the socket exactly once.
export default class ChatBox extends React.Component {
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
