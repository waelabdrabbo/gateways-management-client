import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from '../../../config'
export const gatewaysApiSlice = createApi({
    reducerPath: 'gatewaysApi',
    baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
    tagTypes: ['Gateways'],
    endpoints: (builder) => ({
        getAllGateways: builder.query<any, void>({
            query: () => "gateways",
            providesTags: ['Gateways']
        }),
        getGateway: builder.query({
            query: (gateway) => `gateways/${gateway}`
        }),
        addGateway: builder.mutation({
            query: (gateway) => ({
                url: "gateways",
                method: "POST",
                body: gateway
            }),
            invalidatesTags: ['Gateways']
        }),
        updateGateway: builder.mutation({
            query: (gateway) => ({
                url: `gateways/${gateway._id}`,
                method: "PATCH",
                body: gateway
            }),
            invalidatesTags: ['Gateways']
        }),
        deleteGateway: builder.mutation({
            query: ({ id }) => ({
                url: `gateways/${id}`,
                method: "DELETE",
                body: id
            }),
            invalidatesTags: ['Gateways']
        })
    })
})
export const { useGetAllGatewaysQuery, useGetGatewayQuery, useAddGatewayMutation, useUpdateGatewayMutation, useDeleteGatewayMutation } = gatewaysApiSlice
