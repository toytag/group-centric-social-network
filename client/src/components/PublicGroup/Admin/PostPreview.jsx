import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FixedSizeList } from 'react-window';
import { makeStyles } from '@mui/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import {
  Button, Typography, IconButton, Paper,
} from '@mui/material';

import Forum from '@mui/icons-material/Forum';
import Share from '@mui/icons-material/Share';
import Close from '@mui/icons-material/Close';

import * as utils from '../../../utils/utils';
import { baseURL } from '../../../utils/utils';

const useStyles = makeStyles({

  paper: {
    display: 'inlined',
    textAlign: 'center',
    width: 500,
    height: 150,
    marginTop: '10vw',
    paddingTop: 75,
  },

  fixedSizeList: {
    paddingTop: 20,
    paddingLeft: 20,
  },

  padding: {
    height: 1,
  },

});

export default function PostCard({ post, setPostModal }) {
  const classes = useStyles();
  const navigate = useNavigate();
  const cardStyle = {
    display: 'block',
    width: '500px',
    marginBottom: '25px',
  };

  const handleClick = (postClicked) => {
    navigate(`/publicpost/${postClicked._id}`);
  };

  function renderPost(postToRender) {
    return (
      <div>
        <Card style={cardStyle} elevation={3}>
          <CardHeader
            title={postToRender.title}
            subheader={`${utils.convertTime(postToRender.date)} Written by ${postToRender.author} from ${postToRender.group}`}
            action={<IconButton onClick={() => setPostModal(false)}><Close /></IconButton>}
          />
          <CardActionArea onClick={() => handleClick(postToRender)}>
            <CardMedia
              component={utils.parseFileType(postToRender.attachment.fileType)}
              src={postToRender.attachment.fileID ? `${baseURL}/file/${postToRender.attachment.fileID}` : null}
              controls
            />
            <CardContent>
              <Typography variant="body2">
                {postToRender.content}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size="small" sx={{ color: '#000000', '&:hover': { background: '#f5f5f5' } }} onClick={() => handleClick(postToRender)} startIcon={<Forum />}>
              {postToRender.comments.length}
              {' '}
              Comments
            </Button>

            <Button size="small" sx={{ color: '#000000', '&:hover': { background: '#f5f5f5' } }} startIcon={<Share />}>
              Share
            </Button>

          </CardActions>

        </Card>
        <div className={classes.padding} />
      </div>
    );
  }

  if (post) {
    return (
      <Paper className={classes.previewBG} elevation={3}>
        <FixedSizeList
          height={500}
          width={521}
          itemSize={50}
          itemCount={1}
          className={classes.fixedSizeList}
        >
          {() => renderPost(post)}
        </FixedSizeList>
      </Paper>
    );
  }
  return (
    <Paper className={classes.paper} elevation={3}>
      <Typography variant="h4">
        404 Not Found.
      </Typography>
    </Paper>
  );
}
