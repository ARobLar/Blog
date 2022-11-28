import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import makeStyles from '@mui/styles/makeStyles';
import Box from '@mui/material/Box';
import { useGetPostQuery } from '../../../src/api/apiSlice';
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/router';
import theme from '../../../src/theme';
import { hostBaseUrl } from '../../../src/CONSTANTS';

const useStyles = makeStyles({
 postTitle: {
  minHeight: "120px",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#000",
  fontSize: "3em",
  [theme.breakpoints.down("sm")]: {
    minHeight: "80px",
    fontSize: "2em"
  }
 },
})

export default function DisplayPost() {
  
  const classes = useStyles();
  const router = useRouter();

  const { data: post, isFetching, isSuccess } = useGetPostQuery(router.query.postId as string);
  
  if(isFetching){
    return (
    <Box sx={{display: 'flex'}}>
      Loading...
      <CircularProgress/>
    </Box>
  )}

  if(isSuccess && post){

    const date = (new Date(Date.parse(post.creationTime.toLocaleString())));

    return ( 
      <div>
        <Typography variant="h3" component="h2" className={classes.postTitle}>
          {post.title}
        </Typography>
        <img src={`${hostBaseUrl}/${post.imageSource}`} alt={post.imageLabel} width="100%" />
        <Typography variant="body1" component="h2" color="textSecondary">
          Created: {date.toLocaleDateString()} at {date.toLocaleTimeString()}
        </Typography>
        <Divider/>
        <Typography variant="body2" component="h2" color="textPrimary">
          {post.text}
        </Typography>
      </div>
  )}
}