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
  const [updatePostRequest, {data: postUpdated, isSuccess: postUpdateSuccess}] = useUpdatePostMutation();
  const { data: post, isFetching, isSuccess } = useGetPostQuery(id as string);
  const { data: user, isSuccess: userRetreived } = useGetCurrentUserQuery();
  const isCurrentUser = userRetreived && (user.username == router.query.username);

  async function handleOnSubmit(data : FormData) {
    updatePostRequest({post : data, id: id as string});
  }
  
  if(!isCurrentUser || (postUpdateSuccess && postUpdated)){
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