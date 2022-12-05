import React from "react";
import { makeStyles } from "@mui/styles";
import { useRouter } from "next/router";
import theme from "../../../src/theme";
import { useAddPostMutation, useGetCurrentUserQuery } from "../../../src/api/apiSlice";
import PostForm from "../../../src/components/PostForm";

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
  const [addPost, addPostResult] = useAddPostMutation();
  const { data: user, isFetching, isSuccess } = useGetCurrentUserQuery();
  const isCurrentUser = (user != undefined) && (user.username == router.query.username);

  async function handleOnSubmit(form : FormData) {      
    addPost(form);
  }

  if(addPostResult.isSuccess){
    addPostResult.data ? router.push(`/${router.query.username}`) : alert("Failed to add blog post");
  }

  if(isFetching){
    return <h1>Loading..</h1>
  }
  if(isSuccess && !isCurrentUser){
    router.back();
  }
  
  return (
    <div className={classes.paper}>
      <PostForm onSubmit={handleOnSubmit}/>
    </div>
  );
}