import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { hostApiBaseUrl } from "../CONSTANTS";
import { signInDto, userDto } from "../interfaces/dto";
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
    }),
    signIn: builder.mutation<userDto, signInDto>({
      query: (user) => ({
          url: `/Auth/signIn`,
          method: 'Post',
          body: user
      })
    }),
    signOut: builder.mutation<boolean, string>({
      query: (username) => ({
          url: `/Auth/signOut/${username}`,
          method: 'Post'
      })
    })
  })
})

export const { 
  useGetUsersQuery,
  useGetPostCardsQuery,
  useGetPostQuery,
  useSignInMutation,
  useSignOutMutation
} = apiSlice