import Box from "@mui/material/Box";
import { useRouter } from "next/router";
import { useGetCurrentUserQuery } from "../../src/api/apiSlice";
import AdminRegistrationForm from "../../src/components/admin/AdminRegistrationForm";
import UserTable from "../../src/components/admin/UserTable";
import AwaitingApi from "../../src/components/AwaitingApi";
import FetchErrorManualRefetch from "../../src/components/FetchErrorManualRefetch";

export default function Admin(){
  const router = useRouter();
  const { data: user, 
          isFetching, 
          isSuccess: userRetreived, 
          isError, 
          refetch, 
          error} = useGetCurrentUserQuery();

  if(isFetching){
    return(<AwaitingApi>Loading..</AwaitingApi>)
  }
  else if(isError){
    return(
      <FetchErrorManualRefetch refetch={refetch}>
        Failed to check for authorization
      </FetchErrorManualRefetch>
    );
  }

  if(userRetreived && user.role == "Admin"){
    return(
      <Box>
        <AdminRegistrationForm/>
        <UserTable/>
      </Box>
    );
  }
  else{
    router.back();
  }
}