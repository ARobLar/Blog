import { Button, Grid } from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useGetCurrentUserQuery, useGetPostCardsQuery } from "../api/apiSlice";
import PostCard from "./PostCard";

export default function PaginatedPostGrid({itemsPerPage = 4}){

  const [page, setPage] = useState(1);
  const router = useRouter()
  const queryUsername = router.query.username as string;
  const { data: postCards, isFetching} = useGetPostCardsQuery(queryUsername);
  const { data: user } = useGetCurrentUserQuery();
  
  const isAuthor = (user != undefined) && (user.username == queryUsername);

  if(isFetching)
  {
    return(<div>Loading</div>)
  }

  if(!postCards){
    return <div>No Posts</div>
  }

  const pagePostCards = postCards.slice((page-1)*itemsPerPage, (page)*itemsPerPage);

  return(
    <div>
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
    </div>
  )
}