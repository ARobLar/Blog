import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import React from "react";
import { blogUsersInfo } from "../../../../mockData/blogUsers";
import UserTableList from "./UserTableList";

var users = blogUsersInfo;

export default function UserTable() {

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