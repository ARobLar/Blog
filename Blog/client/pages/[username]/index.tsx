import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import PaginatedPostGrid from '../../src/components/PaginatedPostGrid';
import { useGetUsersQuery } from '../../src/api/apiSlice';
import { useHeadlineStyles } from '../../src/styles/overviewPageStyles';

export default function MemberPage() {
  const classes = useHeadlineStyles();
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
      <Box className={classes.header}>
        <Box>{router.query.username}</Box>
      </Box>
      <Container maxWidth="lg" className={classes.container}>
        <Typography variant="h4" className={classes.title}>
          Blog Posts
        </Typography>
        <PaginatedPostGrid/>
      </Container>
    </div>
  );
}