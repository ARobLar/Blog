import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import theme from "../src/theme";
import { blogUsers } from '../mockData/blogUsers';
import UserCard from '../src/components/UserCard';


const useStyles = makeStyles({
	homeHeader: {
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
	homeContainer: {
		paddingTop: theme.spacing(3)
	},
	title: {
		fontWeight: 800,
		paddingBottom: theme.spacing(3)
	},
})

export default function Home() {
  const classes = useStyles();

  const users = blogUsers;
  return (
    <div>
      <Box className={classes.homeHeader}>
        <Box>Welcome to Bloggalicious</Box>
      </Box>
      <Container maxWidth="lg" className={classes.homeContainer}>
        <Typography variant="h4" className={classes.title}>
          Blogs
        </Typography>
        <Grid container spacing={3}>
          {users.map((blogUser) => (
            <Grid key={blogUser.username} item xs={6} sm={3} md={3}>
              <UserCard user={blogUser} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  )
}
