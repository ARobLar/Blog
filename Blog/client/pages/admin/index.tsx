import { useRouter } from "next/router";
import { useGetCurrentUserQuery } from "../../src/api/apiSlice";
import RegistrationForm from "../../src/components/admin/RegistrationForm";
import UserTable from "../../src/components/admin/UserTable";

export default function Admin(){
  const router = useRouter();
  const {data: user, isFetching, isSuccess} = useGetCurrentUserQuery();

  if(isFetching){
    return(<h1>Loading..</h1>)
  }

  if(isSuccess){

    if(!user || user.role != "Admin"){
      router.back();
    }

    return(
      <>
        <RegistrationForm/>
        <UserTable/>
      </>
    );
  }
}