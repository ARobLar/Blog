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
    getPostCards: builder.query<featuredPost[], string>({
      query: (username) => `/Posts/${username}/all/cards`
    }),
    getPost: builder.query<featuredPost, string>({
      query: (id) => `/Posts/${id}`,
      transformResponse: (post: featuredPost) => {
        return post;
      }
    })
  })
})

export const { 
  useGetUsersQuery,
  useGetPostCardsQuery,
  useGetPostQuery } = apiSlice