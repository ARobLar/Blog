import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container"
import { useSignUpUserAsAdminMutation } from "../../../api/apiSlice";
import RegistrationForm from "../../RegistrationForm";
import { signUpUserDto } from "../../../interfaces/dto";

export default function AdminRegistrationForm(){
  const [signUpUser] = useSignUpUserAsAdminMutation();

  async function handleOnSubmit(userData : signUpUserDto){
    signUpUser(userData);
  }

  return (
    <Container component="main" maxWidth="xs">
      <RegistrationForm asAdmin={true} onSubmit={handleOnSubmit}/>
    </Container>
  );
}