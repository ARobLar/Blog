import React from "react";
import { makeStyles } from "@mui/styles";
import { useRouter } from "next/router";
import theme from "../../../src/theme";
import { useAddPostMutation, useGetCurrentUserQuery } from "../../../src/api/apiSlice";
import PostForm from "../../../src/components/PostForm";
import AwaitingApi from "../../../src/components/AwaitingApi";
import FetchUsersError from "../../../src/components/FetchErrorManualRefetch";

const useStyles = makeStyles({
    paper: {
      margin: theme.spacing(8, 4),
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    },
  });

export default function AddPost() {
  const classes = useStyles();
  const router = useRouter();
  const [addPostRequest, addPostResult] = useAddPostMutation();
  const { data: user, 
          isFetching : isFetchingCurrentUser, 
          isSuccess : isSuccessCurrentUser,
          isError : isErrorCurrentUser,
          refetch : refetchCurrentUser } = useGetCurrentUserQuery();
  const isCurrentUser = (user != undefined) && (user.username == router.query.username);

  async function handleOnSubmit(form : FormData) {      
    addPostRequest(form);
  }


  if(addPostResult.isSuccess){
    addPostResult.data ? router.push(`/${router.query.username}`) : alert("Failed to add blog post");
  }
  else if(addPostResult.isError){
    alert("Error: Failed to add blog post")
  }

  
  if(isFetchingCurrentUser){
    return <AwaitingApi>Checking user credentials..</AwaitingApi>
  }
  else if(isSuccessCurrentUser && !isCurrentUser){
    router.back();
  }
  else if(isErrorCurrentUser){
    return(
      <FetchUsersError refetch={refetchCurrentUser} >
        Failed to check validity of Post Author..
      </FetchUsersError>
    )
  }
  
  return (
    <div className={classes.paper}>
      <PostForm onSubmit={handleOnSubmit}/>
    </div>
  );
}