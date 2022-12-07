import React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import Container from "@mui/material/Container";
import { useRouter } from 'next/router';
import theme from "../src/theme";
import { useGetCurrentUserQuery, useSignUpMutation } from "../src/api/apiSlice";
import RegistrationForm from "../src/components/RegistrationForm";
import { signUpUserDto } from "../src/interfaces/dto";
import AwaitingApi from "../src/components/AwaitingApi";
import Box from "@mui/material/Box";

const useStyles = makeStyles({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
});


export default function SignUp() {
  const classes = useStyles();
  const router = useRouter();
  const [ signUpRequest, 
          {data: signUpSuccess, 
          isLoading: signingUp, 
          isSuccess: signedUp, 
          isError : signUpError,
          status : signUpStatus}] = useSignUpMutation();
  const { data: user, 
          isFetching: isFetchingUser, 
          isSuccess: userRetreived} = useGetCurrentUserQuery();

  async function handleOnSubmit(userData : signUpUserDto){
    signUpRequest(userData);
  }
  
  if(signingUp){
    return <AwaitingApi>Registering..</AwaitingApi>
  }
  else if(signedUp){
    signUpSuccess ? 
    router.push('/') : 
    alert(`You did not get registered, 
          could be due to already exisiting username 
          or invalid password, make sure to include a small & capital letter, a number, and special character`);
  }
  else if(signUpError){
    alert(`Failed to register: "${signUpStatus}"`)
  }

  if(isFetchingUser){
    return <AwaitingApi>Loading..</AwaitingApi>
  }

  if(userRetreived){
    router.push(`/${user.username}`);
  }
  
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box component="div" className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <RegistrationForm onSubmit={handleOnSubmit} />
        <Grid container>
          <Grid item>
            <Button onClick={() => {router.push("/signIn")}} variant="text">
              Already have an account? Sign in
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
