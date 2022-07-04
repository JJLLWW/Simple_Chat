import React from 'react';
import {
  Stack,
  Avatar,
  Typography,
} from '@mui/material';

export default function Message(props) {
  return (
    <Stack align="left" direction="row" alignItems="center" gap="10px">
      <Avatar>{props.senderID}</Avatar>
      <Typography>{props.text}</Typography>
    </Stack>
  );
}
