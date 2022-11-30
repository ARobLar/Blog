import { useGetCurrentUserQuery } from "../../src/api/apiSlice";
import RegistrationForm from "../../src/components/admin/RegistrationForm";
import UserTable from "../../src/components/admin/UserTable";

export default function Admin(){
  const {data: user, isFetching, isSuccess} = useGetCurrentUserQuery();
  
  if(isFetching){
    return(<h1>Loading..</h1>)
  }

  if(isSuccess && user && user.role == "Admin"){
    return(
      <>
      <RegistrationForm/>
      <UserTable/>
    </>
    );
  }
}