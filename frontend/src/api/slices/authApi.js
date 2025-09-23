import { baseApi } from "../baseApi";


export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials
      }),
      invalidatesTags: ['Auth']
    }),
    getProfile: builder.query({
      query: () => '/auth/me',
      providesTags: ['Auth']
    })
  })
});

export const { useLoginMutation, useGetProfileQuery } = authApi;