import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { hostApiBaseUrl } from "../CONSTANTS";
import { featuredPost, featuredUser } from "../interfaces/types";



export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: hostApiBaseUrl}),
  endpoints : builder => ({
    getUsers: builder.query<featuredUser[], void>({
      query: () => `/Users/all/cards`
    }),
    getPostCards: builder.query<featuredPost[], void>({
      query: (username) => `/Posts/${username}/all/cards`
    })
  })
})

export const { 
  useGetUsersQuery,
  useGetPostCardsQuery } = apiSlice