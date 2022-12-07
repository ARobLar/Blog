import Button from "@mui/material/Button"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import { UserRole } from "../interfaces/enums";
import { signUpUserDto } from "../interfaces/dto";
import { useRegistrationFormStyles } from "../styles/formStyles";




interface RegistrationFormProps {
  asAdmin? : boolean;
  onSubmit : (userData : signUpUserDto) => void;
}

export default function RegistrationForm(props : RegistrationFormProps){
  const classes = useRegistrationFormStyles();
  const roles = Object.values(UserRole);

  const {asAdmin=false, onSubmit } = props;

  function handleOnSubmit(event : any){
    event.preventDefault();
    const {target: t } = event
    
    const userData : signUpUserDto = {
      avatarLabel : "RandomImage",
      avatarSource : "https://source.unsplash.com/random",
      role: (asAdmin ? t.role.value : UserRole.Member).toString(),
      email: t.email.value, 
      username: t.username.value, 
      password: t.password.value
    }
    
    onSubmit(userData);

    var form = document.getElementById("registration-form") as HTMLFormElement;
    form.reset();
  }

  return(
    <Box component="form" id="registration-form" className={classes.form} onSubmit={handleOnSubmit}>
      <Grid container spacing={2}>
        {asAdmin &&
          <Grid item xs={12}>
            <Select
            label="Role"
            name="role"
            id="role"
            required
            defaultValue={roles[0]}
            variant="outlined"
            fullWidth
            autoFocus
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role.toString()}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        }
        <Grid item xs={12} sm={6}>
          <TextField
            label="Username"
            name="username"
            id="username"
            required
            inputProps= {{maxLength: "15"}}
            fullWidth
            variant="outlined"
            autoComplete="username"
            autoFocus
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Email Address"
            name="email"
            id="email"
            required
            fullWidth
            variant="outlined"
            autoComplete="email"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Password"
            name="password"
            id="password"
            required
            type="password"
            fullWidth
            variant="outlined"
            autoComplete="current-password"
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
        {asAdmin? "Register User" : "Sign Up"}
      </Button>
    </Box>
  )
}