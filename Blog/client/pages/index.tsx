import Container from '@mui/material/Container';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import theme from "../src/theme";
import PaginatedUserGrid from '../src/components/PaginatedUserGrid';

const useStyles = makeStyles({
	homeHeader: {
		backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(255, 255, 255, 1)), url('https://images.unsplash.com/photo-1558981852-426c6c22a060?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80')`,
		height: "300px",
		backgroundPosition: "center",
		backgroundRepeat: "no-repeat",
		backgroundSize: "cover",
		position: "relative",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		color: "#000",
		fontSize: "5rem",
		[theme.breakpoints.down("sm")]: {
			height: 200,
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
  
  return (
    <div>
      <Box className={classes.homeHeader}>
        Welcome to Bloggalicious
      </Box>
      <Container maxWidth="lg" className={classes.homeContainer}>
        <Typography variant="h4" className={classes.title}>
          Blogs
        </Typography>
        <PaginatedUserGrid itemsPerPage={8}/>
      </Container>
    </div>
  )
}
