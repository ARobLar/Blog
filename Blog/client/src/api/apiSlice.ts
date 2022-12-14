import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { hostBaseUrl } from "../CONSTANTS";
import { postOutDto, signInDto, signUpUserDto, userDto } from "../interfaces/dto";
import { featuredPost, featuredUser } from "../interfaces/types";



export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: `${hostBaseUrl}/api`}),
  tagTypes: ['Users', 'Posts', 'Authorized'],
  endpoints : builder => ({
    getCurrentUser: builder.query<userDto, void>({
      query: () => `/Users/current`,
      providesTags: ['Authorized']
    }),
    getUsers: builder.query<featuredUser[], void>({
      query: () => `/Users/all/cards`,
      providesTags: ['Users']
    }),
    getUsersInfo: builder.query<userDto[], void>({
      query: () => `/Admin/users`,
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
    signUpUserAsAdmin: builder.mutation<boolean, signUpUserDto>({
      query: (user) => ({
        url: `/Admin/create`,
        method: 'Post',
        body: user
      }),
      invalidatesTags: ['Users']
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
      }),
      invalidatesTags: ['Authorized']
    }),
    signOut: builder.mutation<boolean, void>({
      query: () => ({
          url: `/Auth/signOut`,
          method: 'Post'
      }),
      invalidatesTags: ['Authorized']
    })
  })
})

export const { 
  useGetCurrentUserQuery,
  useGetUsersQuery,
  useGetUsersInfoQuery,
  useGetPostCardsQuery,
  useGetPostQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useSignUpUserAsAdminMutation,
  useSignUpMutation,
  useSignInMutation,
  useSignOutMutation
} = apiSlice