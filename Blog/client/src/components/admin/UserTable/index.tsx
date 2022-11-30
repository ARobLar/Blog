import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import React from "react";
import { blogUsersInfo } from "../../../../mockData/blogUsers";
import { useGetUsersInfoQuery } from "../../../api/apiSlice";
import UserTableList from "./UserTableList";

var users = blogUsersInfo;

export default function UserTable() {

  const {data:users, isFetching, isSuccess } = useGetUsersInfoQuery();

  if(isFetching){
    return <h2>Loading..</h2>
  }

  if(isSuccess){
    return(
      <div>
        <Container maxWidth="lg">
          <Typography sx={{fontWeight:"bold", fontSize:"2em"}}>
            Active Accounts
          </Typography>
          <UserTableList users={users}/>
        </Container>
      </div>
    );
  }
  else{
    return<h2>Failed to load users</h2>
  }
}