import { baseApi } from "../baseApi";


export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateUser: builder.mutation({
      query: (data) => ({
        url: '/user/update',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Users']
    }),
    getUser: builder.query({
      query: () => '/user/get',
      providesTags: ['Users']
    })
  })
});

export const { useGetUserQuery , useUpdateUserMutation } = authApi;