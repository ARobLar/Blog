import { Button, Grid } from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useGetCurrentUserQuery, useGetPostCardsQuery } from "../api/apiSlice";
import AwaitingApi from "./AwaitingApi";
import FetchErrorManualRefetch from "./FetchErrorManualRefetch";
import PostCard from "./PostCard";

export default function PaginatedPostGrid({itemsPerPage = 4}){

  const [page, setPage] = useState(1);
  const router = useRouter()
  const queryUsername = router.query.username as string;
  const { data: postCards, 
          isFetching : retrievingPostCards, 
          isError : postCardsError, 
          refetch : refetchPostCards} = useGetPostCardsQuery(queryUsername);
  const { data: user, 
          isSuccess : userRetreived } = useGetCurrentUserQuery();
  
  const isAuthor = userRetreived ? (user.username == queryUsername) : false;

  if(retrievingPostCards)
  {
    return(<AwaitingApi>Loading..</AwaitingApi>)
  }

  if(postCardsError){
    return(
      <FetchErrorManualRefetch refetch={refetchPostCards}>
        Failed to fetch posts
      </FetchErrorManualRefetch>
    ) 
  }

  if(!postCards){
    return <Box component="h2">No Posts</Box>
  }

  const pagePostCards = postCards.slice((page-1)*itemsPerPage, (page)*itemsPerPage);

  return(
    <Box component="div">
      <Grid container spacing={3}>
        {pagePostCards.map((postCard) => (
          <Grid key={postCard.id} item xs={3}>
            <PostCard post={postCard} isAuthor={isAuthor} />
          </Grid>
        ))}
      </Grid>
      <Box 
      justifyContent={"center"} 
      alignItems="center"
      display={"flex"}
      sx={{margin: "20px 0px"}}
      >
        <Button onClick={() => setPage(page - 1)} disabled={page <= 1}>
          Previous
        </Button>
        <Button onClick={() => setPage(page + 1)} disabled={page >= (postCards.length/itemsPerPage)}>
          Next
        </Button>
      </Box>
    </Box>
  )
}