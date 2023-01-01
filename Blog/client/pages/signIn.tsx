import React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import { useRouter } from 'next/router';
import { useGetCurrentUserQuery, useSignInMutation } from "../src/api/apiSlice";
import Box from "@mui/material/Box";
import AwaitingApi from "../src/components/AwaitingApi";
import { userDto } from "../src/interfaces/dto";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";

const useStyles = makeStyles({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center"
  },
  paper: {
    margin: "8px 4px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: "1px",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: "1px"
  },
  submit: {
    margin: "3px 0px 2px"
  }
});

export default function SignIn() {
  const classes = useStyles();
  const router = useRouter();
  const getCurrentUserResult = useGetCurrentUserQuery();
  const [ signInRequest, 
          {isLoading : signingIn,
          isError: signInError,
          error}] = useSignInMutation();
  
  async function handleOnSubmit(event : any) {
    event.preventDefault();
    const {target: t } = event;
    
    signInRequest({
      username : t.username.value,
      password : t.password.value,
      rememberMe : t.remember.checked
    });
  }

  if(signingIn){
    return (<AwaitingApi>Signing in..</AwaitingApi>);
  }
  else if(signInError){
    const e = error as FetchBaseQueryError;
    alert(`${e.status}: ${e.data}`);
  }

  if(getCurrentUserResult.isFetching){
    return (<AwaitingApi>Loading..</AwaitingApi>);
  }
  else if(getCurrentUserResult.isSuccess){
    var user = getCurrentUserResult.data as userDto;
    router.push(`/${user.username}`);
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" className={classes.form} onSubmit={handleOnSubmit}>
            <TextField
              id="username"
              name="username"
              label="Username"
              autoComplete="username"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              inputProps= {{maxLength: "15"}}
              autoFocus
              />
            <TextField
              id="password"
              name="password"
              label="Password"
              autoComplete="current-password"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              type="password"
              title="Password may only contain numbers 0 to 9 and letter a to z"
              />
            <FormControlLabel
              control={<Checkbox id="remember" name="remember" color="primary" />}
              id="rememberMe"
              name="rememberMe"
              label="Remember me"
              />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              >
              Sign In
            </Button>
            <Grid container>
              {/* <Grid item xs>
                <Button href="#" variant="text">
                Forgot password?
                </Button>
              </Grid> */}
              <Grid item>
                <Button onClick={() => {router.push("/signUp")}} variant="text">
                  Don't have an account? Sign Up
                </Button>
              </Grid>
            </Grid>
          </Box>
        </div>
      </Grid>
    </Grid>
  );
};
