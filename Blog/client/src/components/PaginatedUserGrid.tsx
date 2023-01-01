import { Button, Grid } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useGetUsersQuery } from "../api/apiSlice";
import AwaitingApi from "./AwaitingApi";
import FetchErrorManualRefetch from "./FetchErrorManualRefetch";
import UserCard from "./UserCard";

export default function PaginatedUserGrid({itemsPerPage = 4}){

  const [page, setPage] = useState(1);
  const { data: userCards, isFetching, isError, refetch } = useGetUsersQuery();

  if(isFetching)
  {
    return(<AwaitingApi>Loading..</AwaitingApi>)
  }
  else if(isError){
    return(
      <FetchErrorManualRefetch refetch={refetch}>
        Failed to fetch users
      </FetchErrorManualRefetch>
    ) 
  }

  if(!userCards){
    return <Box component="h2">No Users</Box>
  }
  
  const pageUserCards = userCards.slice((page-1)*itemsPerPage, (page)*itemsPerPage);
  
  return(
    <Box component="div">
      <Grid container spacing={3}>
        {pageUserCards.map((userCard) => (
          <Grid key={userCard.username} item xs={3}>
            <UserCard user={userCard} />
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
        <Button onClick={() => setPage(page + 1)} disabled={page >= (userCards.length/itemsPerPage)}>
          Next
        </Button>
      </Box>
    </Box>
  )
}