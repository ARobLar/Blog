import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';
import { useRouter } from 'next/router';

export default function Navigationbar() {
  const router = useRouter();

  return (
    <AppBar>
      <Toolbar>
        <IconButton href="/" size='large' edge='start' color='inherit' aria-label='logo'>
          <HomeIcon/>
        </IconButton>
        <Typography variant='h6' component='div' sx={{ flexGrow: 1}}>
          Bloggalicious
        </Typography>
        <Stack direction='row' spacing={2}>
          <Button onClick={() => (router.push('/addBlogPost'))} color='inherit' >New Post</Button>
          <Button onClick={() => (router.push('/admin'))} color='inherit'>Admin</Button>
          <Button onClick={() => (router.push('/[username]'))} color='inherit'>My Page</Button>
          <Button onClick={() => (router.push('/'))} color='inherit'>Log out</Button>
          <Button onClick={() => (router.push('/signUp'))} color='inherit'>Sign up</Button>
          <Button onClick={() => (router.push('/login'))} color='inherit'>Log in</Button>
        </Stack>
      </Toolbar>
    </AppBar>
 );
}