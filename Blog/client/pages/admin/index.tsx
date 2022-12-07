import Box from "@mui/material/Box";
import { useRouter } from "next/router";
import { useGetCurrentUserQuery } from "../../src/api/apiSlice";
import AdminRegistrationForm from "../../src/components/admin/AdminRegistrationForm";
import UserTable from "../../src/components/admin/UserTable";
import AwaitingApi from "../../src/components/AwaitingApi";
import FetchUsersFailure from "../../src/components/FetchErrorManualRefetch";

export default function Admin(){
  const router = useRouter();
  const {data: user, isFetching, isError, refetch, error} = useGetCurrentUserQuery();

  if(isFetching){
    return(<AwaitingApi>Loading..</AwaitingApi>)
  }
  else if(isError){
    return(<FetchUsersFailure refetch={refetch} error={error}/>)
  }

  if(!user || user.role != "Admin"){
    router.back();
  }

  return(
    <Box>
      <AdminRegistrationForm/>
      <UserTable/>
    </Box>
  );
}