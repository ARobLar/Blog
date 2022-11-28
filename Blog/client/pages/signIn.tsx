import React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from "react-redux";
import { authUser } from "../src/interfaces/types";
import { selectLoggedIn, selectUsername, signIn } from "../src/slices/userSlice";
import { useSignInMutation } from "../src/api/apiSlice";
import { UserRole } from "../src/interfaces/enums";

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
  const dispatch = useDispatch();
  const loggedIn = useSelector(selectLoggedIn);
  const username = useSelector(selectUsername);
  const [signInRequest, signInResult] = useSignInMutation();
  
  async function handleOnSubmit(event) {
    event.preventDefault();
    const t = event.target;
    
    const result = await signInRequest({
      username : t.name.value,
      password : t.password.value,
      rememberMe : t.remember.checked
    }).unwrap();

    if(result){

      const cachedUser : authUser = {
        id : result.id,
        username : result.username,
        role : result.role as UserRole,
        loggedIn : true
      }
      console.log("Signing in");

      localStorage.setItem("user", JSON.stringify(cachedUser));
      dispatch(signIn(cachedUser));
    }
    else{
      alert("Failed to Sign in")
    }
  }

  if(signInResult.isLoading){
    return <div>Attemping to sign in..</div>
  }
  
  if(signInResult.isError){
    console.log(signInResult.error);
    return <div>An error occured while attempting to sign in!</div>
  }

  if(loggedIn){
    router.push(`/${username}`);
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
          <form className={classes.form} onSubmit={handleOnSubmit}>
            <TextField
              id="name"
              name="name"
              label="Name"
              autoComplete="name"
              variant="outlined"
              margin="normal"
              required
              fullWidth
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
              // pattern= "[a-z0-9]{1,15}"
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
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/SignUp" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Grid>
    </Grid>
  );
};
