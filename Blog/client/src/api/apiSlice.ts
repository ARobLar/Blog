import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { hostApiBaseUrl } from "../CONSTANTS";
import { featuredUser } from "../interfaces/types";



export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: hostApiBaseUrl}),
  endpoints : builder => ({
    getUsers: builder.query<featuredUser[], void>({
      query: () => `/Users/all/cards`
    })
    // getUserCards: builder.query({
    //   query: ({startIndex, count}) => ({ `/Users${startIndex}` 
    // })
    //})
  })
})

export const { useGetUsersQuery } = apiSlice