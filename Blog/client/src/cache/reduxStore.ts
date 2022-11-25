import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

export const reduxStore = configureStore({
    reducer : {
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware)
});


// Infer the 'RootState' and 'AppDispatch' types from the store itself
export type RootState = ReturnType<typeof reduxStore.getState>

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof reduxStore.dispatch