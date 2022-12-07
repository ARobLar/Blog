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
  const [signUpRequest, signUpResult] = useSignUpMutation();
  const { data: user, 
          isFetching: isFetchingUser, 
          isSuccess: isSuccessUser} = useGetCurrentUserQuery();

  async function handleOnSubmit(userData : signUpUserDto){
    signUpRequest(userData);
  }
  
  if(signUpResult.isLoading){
    return <AwaitingApi>Registering..</AwaitingApi>
  }
  else if(signUpResult.isSuccess){
    signUpResult.data ? 
    router.push('/') : 
    alert(`You did not get registered, 
          could be due to already exisiting username 
          or invalid password, make sure to include a small & capital letter, a number, and special character`);
  }
  else if(signUpResult.isError){
    alert(`Failed to register: "${signUpResult.status}"`)
  }

  if(isFetchingUser){
    return <AwaitingApi>Loading..</AwaitingApi>
  }

  if(isSuccessUser && user){
    router.push(`/${user.username}`);
  }
  
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
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
      </div>
    </Container>
  );
}
