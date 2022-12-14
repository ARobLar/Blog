import { makeStyles } from "@mui/styles";
import theme from "../theme";

export const usePostFormStyles = makeStyles({
  form: {
    width: "50%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
});


export const useRegistrationFormStyles = makeStyles({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
});