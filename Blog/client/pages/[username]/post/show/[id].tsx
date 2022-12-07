import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import Box from '@mui/material/Box';
import { useGetPostQuery } from '../../../../src/api/apiSlice';
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/router';
import { hostBaseUrl } from '../../../../src/CONSTANTS';
import Stack from '@mui/material/Stack';
import theme from '../../../../src/theme';
import AwaitingApi from '../../../../src/components/AwaitingApi';

const useStyles = makeStyles({
 main: {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
 },
 postTitle: {
  minHeight: "10vw",
  display: "flex",
  alignItems: "center",
  fontSize: "5vw",
 },
 image: {
  maxHeight: "20vw",
  maxWidth: "40vw",
  marginBottom: "20px",
 },
 date: {
  fontSize: "2vw",
  [theme.breakpoints.down("md")]: {
    fontSize: "3vw"
  }
 },
 text: {
  fontSize: "16px",
  margin: "0 10px",
  [theme.breakpoints.down("md")]: {
    fontSize: "12px"
  }
 }
})

export default function DisplayPost() {
  
  const classes = useStyles();
  const router = useRouter();
  const { id } = router.query;
  const { data: post, isFetching, isSuccess } = useGetPostQuery(id as string);
  
  if(isFetching){
    return (<AwaitingApi>Loading...</AwaitingApi>)
  }

  if(isSuccess && post){

    const date = (new Date(Date.parse(post.creationTime.toLocaleString())));

    return ( 
      <Stack className={classes.main}>
        <Typography className={classes.postTitle}>
          {post.title}
        </Typography>
        <img className={classes.image} src={`${hostBaseUrl}/${post.imageSource}`} alt={post.imageLabel} width="100%" />
        <Typography className={classes.date} color="textSecondary">
          Created: {date.toLocaleDateString()} at {date.toLocaleTimeString()}
        </Typography>
        <Typography className={classes.text} color="textPrimary">
          {post.text}
        </Typography>
      </Stack>
  )}
}