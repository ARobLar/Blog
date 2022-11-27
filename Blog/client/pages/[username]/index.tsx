import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import theme from "../../src/theme";
import { blogPosts } from "../../mockData/blogPostCards";
import PostCard from '../../src/components/PostCard';

const useStyles = makeStyles({
	accountTitle: {
		backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(255, 255, 255, 1)), url('https://images.unsplash.com/photo-1558981852-426c6c22a060?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80')`,
		height: "300px",
		backgroundPosition: "center",
		backgroundRepeat: "no-repeat",
		backgroundSize: "cover",
		position: "relative",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		color: "#000",
		fontSize: "4rem",
		[theme.breakpoints.down("sm")]: {
			height: 300,
			fontSize: "3em"
		}
	},
	blogHomeContainer: {
		paddingTop: theme.spacing(3)
	},
	blogTitle: {
		fontWeight: 800,
		paddingBottom: theme.spacing(3)
	},
})

export default function MemberPage() {
  const classes = useStyles()
  const posts = blogPosts;
  
  return (
    <div>
      <Box className={classes.accountTitle}>
        <Box></Box>
      </Box>
      <Container maxWidth="lg" className={classes.blogHomeContainer}>
        <Typography variant="h4" className={classes.blogTitle}>
          Blog Posts
        </Typography>
        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid key={post.id} item xs={6} sm={3} md={3}>
              <PostCard post={post}/>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}