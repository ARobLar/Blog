import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container"
import { useSignUpUserAsAdminMutation } from "../../../api/apiSlice";
import RegistrationForm from "../../RegistrationForm";
import { signUpUserDto } from "../../../interfaces/dto";
import AwaitingApi from "../../AwaitingApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";

export default function AdminRegistrationForm(){
  const [signUpUserRequest, 
        {isLoading: signingUpUser, 
        isSuccess: signedUpUser, 
        isError: signUpUserError,
        error}] = useSignUpUserAsAdminMutation();

  async function handleOnSubmit(userData : signUpUserDto){
    signUpUserRequest(userData);
  }

  if(signingUpUser){
    return <AwaitingApi>Registering User..</AwaitingApi>
  }
  else if(signedUpUser){
    alert(`Succeded to register user`)
  }
  else if(signUpUserError){
    const e = error as FetchBaseQueryError
    alert(`Failed to register:\n${e.data}`);
  }

  return (
    <Container component="main" maxWidth="xs">
      <RegistrationForm asAdmin={true} onSubmit={handleOnSubmit}/>
    </Container>
  );
}