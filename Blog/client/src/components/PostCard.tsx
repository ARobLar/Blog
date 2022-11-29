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
import { useDeletePostMutation } from '../api/apiSlice';

interface PostCardProps {
  post : featuredPost
}

const useStyles = makeStyles({
 card: {
  maxWidth: "100%",
 },
 media: {
  height: 250
 },
 cardActions: {
  display: "flex",
  margin: "0 10px",
  justifyContent: "space-between"
 },
})

export default function PostCard(props: PostCardProps) {
  const classes = useStyles();
  const router = useRouter();
  const [deletePost] = useDeletePostMutation();
  const { post } = props;
  const dateTime = new Date(Date.parse(post.creationTime.toLocaleString()));

  function handleOnDelete(){
    deletePost(post.id);
  }

  return (
    <Card className={classes.card}>
      <CardActionArea onClick={() => { router.push(`/${router.query.username}/${post.id}/${post.title}`) }}>
        <CardMedia
          className={classes.media}
          image={`${hostBaseUrl}/${post.imageSource}`}
          title={post.imageLabel}
        />
        <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {post.title}
        </Typography>
        <Typography variant="body1" component="h2" color="777">
          {dateTime.toLocaleDateString()} - {dateTime.toLocaleTimeString()}
        </Typography>
        <Typography variant="body2" color="textPrimary" component="p">
          {post.text}..
        </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <IconButton onClick={() => ({})}>
          <EditOutlinedIcon sx={{color: blue[500]}} fontSize='large' />
        </IconButton>
        <IconButton onClick={handleOnDelete}>
          <DeleteOutlinedIcon sx={{color: red[500]}} fontSize='large'/>
        </IconButton>
      </CardActions>
    </Card>
 );
}