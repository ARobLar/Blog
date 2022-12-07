import React from "react";
import { useRouter } from "next/router";
import { useGetCurrentUserQuery, useGetPostQuery, useUpdatePostMutation } from "../../../../src/api/apiSlice";
import { hostBaseUrl } from "../../../../src/CONSTANTS";
import PostForm from "../../../../src/components/PostForm";
import { usePostFormStyles } from "../../../../src/styles/formStyles";
import AwaitingApi from "../../../../src/components/AwaitingApi";
import Box from "@mui/material/Box";

export default function HandlePost() {
  const classes = usePostFormStyles();
  const router = useRouter();
  const { id } = router.query;
  const [updatePost] = useUpdatePostMutation();
  const {data: post, isFetching, isSuccess } = useGetPostQuery(id as string);
  const { data: user, isSuccess: isSuccessUser } = useGetCurrentUserQuery();
  const isCurrentUser = (user != undefined) && (user.username == router.query.username);

  async function handleOnSubmit(data : FormData) {
    
    let success = false;
    success = await updatePost({post : data, id: id as string}).unwrap();

    if(success) {
      router.back();
    }
  }
  
  if(isSuccessUser && !isCurrentUser){
    router.back();
  }

  if(isFetching){
    return(<AwaitingApi>Loading..</AwaitingApi>)
  } 
  else if(isSuccess){
    if(post == null){
      return(<Box component="h3">Invalid post identifier</Box>)
    }

    return (
      <PostForm initialValues={{
                    title : post.title, 
                    imageUrl : `${hostBaseUrl}/${post.imageSource}`, 
                    imageLabel : post.imageLabel, 
                    text : post.text}} 
                onSubmit={handleOnSubmit}/>
    );
  }
}