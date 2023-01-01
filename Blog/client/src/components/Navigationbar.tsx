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
import { CircularProgress, styled } from '@mui/material';
import theme from '../theme';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles({
  title:{
    flexGrow: 1, 
    fontSize: "2vw",
    [theme.breakpoints.only("xs")]: {
      display: 'none'
    }
  }
})

const NavButton = styled(Button)(() => ({
  fontSize: "16px",
  [theme.breakpoints.only("xs")]: {
    fontSize: "10px",
    marginLeft: "-10px",
    paddingLeft: "-10px"
  },
  [theme.breakpoints.only("sm")]: {
    fontSize: "10px"
  },
  [theme.breakpoints.only("md")]: {
    fontSize: "12px"
  },
}));

export default function Navigationbar() {
  const classes = useStyles();
  const router = useRouter();
  const {data: user, isSuccess : userRetreived} = useGetCurrentUserQuery();
  const [signOutRequest, {isLoading : signingOut, isError : signOutError}] = useSignOutMutation();

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
          <IconButton onClick={()=>(router.push('/'))} size='large' edge='start' color='inherit' aria-label='logo'>
            <HomeIcon/>
          </IconButton>
          <Typography className={classes.title} >
            {userRetreived ? user.username : "Bloggalicious" }
          </Typography>
          <Stack direction='row' spacing={2}>
            {signingOut && 
              <CircularProgress sx={{ color: 'grey.100' }}/>}
            {signOutError && 
              <Typography>Failed to log out</Typography>}
            {userRetreived && user.role == "Admin" &&
              <NavButton onClick={() => (router.push(`/admin`))} color='inherit'>Admin</NavButton>
            }
            {userRetreived &&
              <Box>
                <NavButton onClick={() => (router.push(`/${user.username}/post/add`))} color='inherit' >New Post</NavButton>
                <NavButton onClick={() => (router.push(`/${user.username}`))} color='inherit'>My Page</NavButton>
                <NavButton onClick={handleSignOut} color='inherit'>Sign out</NavButton>
              </Box>
            }
            {!user &&
              <Box>
                <NavButton onClick={() => (router.push('/signUp'))} color='inherit'>Sign up</NavButton>
                <NavButton onClick={() => (router.push('/signIn'))} color='inherit'>Sign in</NavButton>
              </Box>
            }
          </Stack>
        </Toolbar>
      </AppBar>
      <Box sx={{mt: 8}}></Box>
    </>
 );
}