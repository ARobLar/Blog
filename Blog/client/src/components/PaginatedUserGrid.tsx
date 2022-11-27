import { Button, Grid } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useGetUsersQuery } from "../api/apiSlice";
import UserCard from "./UserCard";

export default function PaginatedUserGrid({itemsPerPage = 4}){

  const [page, setPage] = useState(1);
  const { data: userCards, isFetching} = useGetUsersQuery();

  if(isFetching)
  {
    return(<div>Loading</div>)
  }

  if(!userCards){
    return <div>No Users</div>
  }

  const pageUserCards = userCards.slice((page-1)*itemsPerPage, (page)*itemsPerPage);

  return(
    <div>
      <Grid container spacing={3}>
        {pageUserCards.map((userCard) => (
          <Grid key={userCard.username} item xs={6} sm={3} md={3}>
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
    </div>
  )
}