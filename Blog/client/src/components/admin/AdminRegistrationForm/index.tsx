import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container"
import { useSignUpUserAsAdminMutation } from "../../../api/apiSlice";
import RegistrationForm from "../../RegistrationForm";
import { signUpUserDto } from "../../../interfaces/dto";
import AwaitingApi from "../../AwaitingApi";

export default function AdminRegistrationForm(){
  const [signUpUserRequest, signUpUserResult] = useSignUpUserAsAdminMutation();

  async function handleOnSubmit(userData : signUpUserDto){
    signUpUserRequest(userData);
  }

  if(signUpUserResult.isLoading){
    return <AwaitingApi>Registering..</AwaitingApi>
  }
  else if(signUpUserResult.isSuccess){
    alert(`${signUpUserResult.data ? "Succeded" : "Failed"} to register user`)
  }
  else if(signUpUserResult.isError){
    alert(`Failed to register user: ${signUpUserResult.status}`)
  }

  return (
    <Container component="main" maxWidth="xs">
      <RegistrationForm asAdmin={true} onSubmit={handleOnSubmit}/>
    </Container>
  );
}