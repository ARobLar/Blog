import React from "react";
import { makeStyles } from "@mui/styles";
import { useRouter } from "next/router";
import theme from "../../../src/theme";
import { useAddPostMutation, useGetCurrentUserQuery } from "../../../src/api/apiSlice";
import PostForm from "../../../src/components/PostForm";
import AwaitingApi from "../../../src/components/AwaitingApi";
import FetchUsersError from "../../../src/components/FetchErrorManualRefetch";
import Box from "@mui/material/Box";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import FetchErrorManualRefetch from "../../../src/components/FetchErrorManualRefetch";

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
  const [addPostRequest, 
        {data: post,
        isLoading: addingPost,
        isSuccess: postAdded,
        isError: addPostError,
        error}] = useAddPostMutation();
  const { data: user, 
          isFetching : isFetchingCurrentUser, 
          isSuccess : userRetreived,
          isError : isErrorCurrentUser,
          refetch : refetchCurrentUser } = useGetCurrentUserQuery();
  const isCurrentUser = userRetreived && (user.username == router.query.username);

  async function handleOnSubmit(form : FormData) {      
    addPostRequest(form);
  }

  if(postAdded){
    router.push(`/${router.query.username}`);
  }
  else if(addPostError){
    var e = error as FetchBaseQueryError;
    alert(`${e.status}: ${e.data}`)
  }

  
  if(isFetchingCurrentUser){
    return <AwaitingApi>Checking user credentials..</AwaitingApi>
  }
  else if(!isCurrentUser){
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
    <Box component="div" className={classes.paper}>
      <PostForm onSubmit={handleOnSubmit}/>
      {addingPost && <AwaitingApi>Adding Post..</AwaitingApi>}
    </Box>
  );
}