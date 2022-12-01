import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PaginatedUserGrid from '../src/components/PaginatedUserGrid';
import { useHeadlineStyles } from '../src/styles/overviewPageStyles';

export default function Home() {
  const classes = useHeadlineStyles();
  
  return (
    <div>
      <Box className={classes.header}>
        Welcome to Bloggalicious
      </Box>
      <Container maxWidth="lg" className={classes.container}>
        <Typography variant="h4" className={classes.title}>
          Blogs
        </Typography>
        <PaginatedUserGrid itemsPerPage={8}/>
      </Container>
    </div>
  )
}
