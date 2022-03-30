/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';

import { makeStyles } from '@mui/styles';
import { Typography, Paper } from '@mui/material';

import * as utils from '../../utils/utils';
import { baseURL } from '../../utils/utils';

const useStyles = makeStyles({
  img: {
    width: 300,
    borderRadius: '2%',
  },

  self: {
    display: 'flex',
    justifyContent: 'right',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },

  other: {
    display: 'flex',
    justifyContent: 'left',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 10,
  },

  text: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    maxWidth: 300,
    minWidth: 40,
  },

});

export default function MessageBubble({ message, self }) {
  const classes = useStyles();
  function renderContent(messageToRender) {
    switch (messageToRender.type) {
      case 'text':
        return (
          <div className={self === messageToRender.from ? classes.self : classes.other}>
            <Paper className={classes.text} sx={{ backgroundColor: '#fff5e1' }} elevation={1}>
              <Typography variant="subtitle1">
                {messageToRender.content}
              </Typography>
            </Paper>
          </div>
        );
      case 'audio':
        return (
          <div className={self === messageToRender.from ? classes.self : classes.other}>
            <audio src={`${baseURL}/file/${messageToRender.content}`} controls="controls" />
          </div>
        );
      case 'image':
        return (
          <div className={self === messageToRender.from ? classes.self : classes.other}>
            <img className={classes.img} src={`${baseURL}/file/${messageToRender.content}`} alt="" />
          </div>
        );
      case 'video':
        return (
          <div className={self === messageToRender.from ? classes.self : classes.other}>
            <video className={classes.img} src={`${baseURL}/file/${messageToRender.content}`} controls="controls" />
          </div>
        );
      default:
    }
    return (<div />);
  }

  return (
    <div>

      <Typography align="center">
        {utils.messageTime(message.date)}
      </Typography>
      {renderContent(message)}

    </div>
  );
}
