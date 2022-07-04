import React from 'react';
import {
  TextField,
} from '@mui/material';

// it's ok to put the helper in the function component as this component is only used once,
// so won't keep re-initialising.
export default function ChatEntry(props) {
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
