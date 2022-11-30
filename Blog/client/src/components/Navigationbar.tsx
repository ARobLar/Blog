import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';
import Box from '@mui/material/Box';
import { useRouter } from 'next/router';
import { useGetCurrentUserQuery, useSignOutMutation } from '../api/apiSlice';
import { CircularProgress } from '@mui/material';

export default function Navigationbar() {
  const router = useRouter();
  const {data: user, isSuccess} = useGetCurrentUserQuery();
  const [signOutRequest, signOutResult] = useSignOutMutation();

  async function handleSignOut(){
    const result = await signOutRequest().unwrap();
    
    if(result){
      router.push('/');
    }
  }

  return (
    <>
      <AppBar>
        <Toolbar>
          <IconButton href="/" size='large' edge='start' color='inherit' aria-label='logo'>
            <HomeIcon/>
          </IconButton>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1}}>
            Bloggalicious
          </Typography>
          <Stack direction='row' spacing={2}>
            {signOutResult.isLoading && 
              <CircularProgress sx={{ color: 'grey.100' }}/>}
            {signOutResult.isError && 
              <Typography>Failed to log out</Typography>}
            {isSuccess && user && user.role == "Admin" &&
              <Button onClick={() => (router.push(`/admin`))} color='inherit'>Admin</Button>
            }
            {isSuccess && user &&
              <>
                <Button onClick={() => (router.push(`/${user.username}/post/add`))} color='inherit' >New Post</Button>
                <Button onClick={() => (router.push(`/${user.username}`))} color='inherit'>My Page</Button>
                <Button onClick={handleSignOut} color='inherit'>Sign out</Button>
              </>
            }
            {!user &&
              <>
                <Button onClick={() => (router.push('/signUp'))} color='inherit'>Sign up</Button>
                <Button onClick={() => (router.push('/signIn'))} color='inherit'>Sign in</Button>
              </>
            }
          </Stack>
        </Toolbar>
      </AppBar>
      <Box sx={{mt: 8}}></Box>
    </>
 );
}