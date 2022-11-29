import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { hostBaseUrl } from "../CONSTANTS";
import { postOutDto, signInDto, signUpUserDto, userDto } from "../interfaces/dto";
import { featuredPost, featuredUser } from "../interfaces/types";



export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: `${hostBaseUrl}/api`}),
  tagTypes: ['Users', 'Posts'],
  endpoints : builder => ({
    getUsers: builder.query<featuredUser[], void>({
      query: () => `/Users/all/cards`,
      providesTags: ['Users']
    }),
    getPostCards: builder.query<featuredPost[], string>({
      query: (username) => `/Posts/${username}/all/cards`,
      providesTags: ['Posts']
    }),
    getPost: builder.query<featuredPost, string>({
      query: (id) => `/Posts/${id}`,
      providesTags: ['Posts']
    }),
    addPost: builder.mutation<boolean, FormData>({
      query: (post) => ({
        url: `/Posts/create`,
        method: 'Post',
        body: post
      }),
      invalidatesTags: ['Posts']
    }),
    updatePost: builder.mutation<boolean, {post : FormData, id : string }>({
      query: ({post, id}) => ({
        url: `/Posts/update/${id}`,
        method: 'Put',
        body: post
      }),
      invalidatesTags: ['Posts']
    }),
    deletePost: builder.mutation<boolean, string>({
      query: (id) => ({
        url: `/Posts/${id}`,
        method: 'Post'
      }),
      invalidatesTags: ['Posts']
    }),
    signUp: builder.mutation<boolean, signUpUserDto>({
      query: (user) => ({
        url: `/Users/create`,
        method: 'Post',
        body: user
      }),
      invalidatesTags: ['Users']
    }),
    signIn: builder.mutation<userDto, signInDto>({
      query: (user) => ({
          url: `/Auth/signIn`,
          method: 'Post',
          body: user
      })
    }),
    signOut: builder.mutation<boolean, void>({
      query: () => ({
          url: `/Auth/signOut`,
          method: 'Post'
      })
    })
  })
})

export const { 
  useGetUsersQuery,
  useGetPostCardsQuery,
  useGetPostQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useSignUpMutation,
  useSignInMutation,
  useSignOutMutation
} = apiSlice