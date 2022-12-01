import Container from '@mui/material/Container';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import theme from "../../src/theme";
import { useRouter } from 'next/router';
import PaginatedPostGrid from '../../src/components/PaginatedPostGrid';
import { useGetCurrentUserQuery, useGetUsersQuery } from '../../src/api/apiSlice';
import { useEffect } from 'react';

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
    margin: "0px -8px",
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
  const classes = useStyles();
  const router = useRouter();

  // For scalability, consider checking if user exists on server side instead, since all users may not be cached
  const { data: users } = useGetUsersQuery();
  
  //Ensure selected user exists
  if(users?.find(({username}) => username == router.query.username) == undefined)
  {
    return <div>Sorry, couldn't find the blogger you're searching for</div>
  }

  return (
    <div>
      <Box className={classes.accountTitle}>
        <Box>{router.query.username}</Box>
      </Box>
      <Container maxWidth="lg" className={classes.blogHomeContainer}>
        <Typography variant="h4" className={classes.blogTitle}>
          Blog Posts
        </Typography>
        <PaginatedPostGrid/>
      </Container>
    </div>
  );
}