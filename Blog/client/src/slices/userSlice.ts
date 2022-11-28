import { createSlice } from '@reduxjs/toolkit';
import { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from '../cache/reduxStore';
import { UserRole } from '../interfaces/enums';
import { authUser } from '../interfaces/types';

let user;

if(typeof window != 'undefined'){
  user = localStorage.getItem('user');
}

const initialState : authUser = user ? JSON.parse(user) : {};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signIn: (state, action: PayloadAction<authUser>) => {
          state = action.payload;
        },
        signOut: (state) => {
          state.id = "";
          state.username = "";
          state.role = UserRole.Anonymous;
          state.loggedIn = false;
        }
    }
})

export const { signIn, signOut } = userSlice.actions;

export const selectLoggedIn = (state: RootState) => state.user.loggedIn;
export const selectRole = (state: RootState) => state.user.role;
export const selectIsAdmin = (state: RootState) => state.user.role == UserRole.Admin;
export const selectId = (state: RootState) => state.user.id;
export const selectUsername = (state: RootState) => state.user.username;

export default userSlice.reducer;