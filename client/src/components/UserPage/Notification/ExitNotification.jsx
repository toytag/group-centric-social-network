import React from 'react';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { Typography, Paper, IconButton } from '@mui/material';

import Close from '@mui/icons-material/Close';
import * as fetchUser from '../../../utils/fetchUser';

const useStyles = makeStyles({
  card: {
    width: 700,
    height: 100,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
  },

  content: {
    display: 'flex',
    justifyContent: 'center',
  },

});

export default function ExitNotification({ notification, userID }) {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleClickClose = async () => {
    await fetchUser.deleteNotification(userID, notification.id);
    navigate(0);
  };

  return (
    <Paper className={classes.card}>
      <IconButton sx={{ marginLeft: '660px' }} onClick={handleClickClose}>
        <Close />
      </IconButton>
      <div className={classes.content}>
        <Typography variant="h5" color="secondary">
          {notification.from}
        </Typography>
        <Typography variant="h5">
                    &thinsp; exited &thinsp;
        </Typography>
        <Typography variant="h5" color="secondary">
          {notification.to}
        </Typography>
        <Typography variant="h5">
          .
        </Typography>
      </div>
    </Paper>

  );
}
