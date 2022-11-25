import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { hostApiBaseUrl } from "../CONSTANTS";

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: hostApiBaseUrl}),
  endpoints : builder => ({
    getUsers: builder.query({
      query: () => `/Users`
    })
  })
})

export const { useGetUsersQuery } = apiSlice