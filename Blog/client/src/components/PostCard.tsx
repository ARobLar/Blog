import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import IconButton from '@mui/material/IconButton';
import { red, blue } from '@mui/material/colors';
import { featuredPost, featuredUser } from '../interfaces/types';
import { useRouter } from 'next/router';
import { hostBaseUrl }  from "../CONSTANTS";
import { useDeletePostMutation, useGetCurrentUserQuery } from '../api/apiSlice';
import { useCardStyles } from '../styles/overviewPageStyles';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import Button from '@mui/material/Button';

interface PostCardProps {
  post : featuredPost,
  isAuthor : boolean
}

export default function PostCard(props: PostCardProps) {
  const classes = useCardStyles();
  const router = useRouter();
  const [deletePost] = useDeletePostMutation();
  const { post, isAuthor } = props;
  const dateTime = new Date(Date.parse(post.creationTime.toLocaleString()));

  return (
    <Card className={classes.card}>
      <CardActionArea onClick={() => { router.push(`/${router.query.username}/post/show/${post.id}/`) }}>
        <CardMedia
          className={classes.media}
          image={`${hostBaseUrl}/${post.imageSource}`}
          title={post.imageLabel}
        />
        <CardContent className={classes.content}>
        <Typography className={classes.title}>
          {post.title}
        </Typography>
        <Typography className={classes.date}>
          {dateTime.toLocaleDateString()} - {dateTime.toLocaleTimeString()}
        </Typography>
        <Typography className={classes.text}>
          {post.text}..
        </Typography>
        </CardContent>
      </CardActionArea>
      {isAuthor &&
        <CardActions className={classes.actions}>
          <IconButton onClick={() => {router.push(`/${router.query.username}/post/edit/${post.id}/`)}}>
            <EditOutlinedIcon className={classes.icon} sx={{color: blue[500]}}/>
          </IconButton>
          <IconButton onClick={() => {deletePost(post.id)}}>
            <DeleteOutlinedIcon className={classes.icon} sx={{color: red[500]}}/>
          </IconButton>
        </CardActions>
      }
    </Card>
 );
}