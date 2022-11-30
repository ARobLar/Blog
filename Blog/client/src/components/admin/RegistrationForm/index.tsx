import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import makeStyles from "@mui/styles/makeStyles";
import Container from "@mui/material/Container"
import theme from "../../../theme";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { UserRole } from "../../../interfaces/enums";
import Box from "@mui/material/Box";

const useStyles = makeStyles({
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(3)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    }
});

export default function RegistrationForm(){
  const classes = useStyles();

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const t = e.target;

    console.log(t.Role.value);
    console.log(t.name.value);
    console.log(t.email.value);
    console.log(t.password.value);
    
  }
  const roles = Object.values(UserRole);
  return (
    <Container component="main" maxWidth="xs">
      <Box component="form" className={classes.form} onSubmit={handleOnSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Select
            id="role"
            name="Role"
            label="Role"
            variant="outlined"
            defaultValue={roles[0]}
            required
            fullWidth
            autoFocus
            >
              {roles.map((role) => (
                <MenuItem value={role}>
                  {role.toString()}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="name"
              name="Name"
              label="Name"
              autoComplete="name"
              variant="outlined"
              required
              fullWidth
              autoFocus
              />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="email"
              name="email"
              label="Email Address"
              autoComplete="email"
              variant="outlined"
              required
              fullWidth
              />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="password"
              name="Password"
              label="Password"
              autoComplete="current-password"
              variant="outlined"
              required
              fullWidth
              type="password"
              />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          >
          Register User
        </Button>
      </Box>
    </Container>
  );
}