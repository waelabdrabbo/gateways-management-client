import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from '../../../config'

export const gatewaysApiSlice = createApi({
    reducerPath: 'gatewaysApi',
    baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
    tagTypes: ['Gateways', 'Devices'],
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
            invalidatesTags: ['Gateways', 'Devices']
        }),
        updateGateway: builder.mutation({
            query: (gateway) => ({
                url: `gateways/${gateway._id}`,
                method: "PATCH",
                body: gateway
            }),
            invalidatesTags: ['Gateways', 'Devices']
        }),
        deleteGateway: builder.mutation({
            query: ({ id }) => ({
                url: `gateways/${id}`,
                method: "DELETE",
                body: id
            }),
            invalidatesTags: ['Gateways', 'Devices']
        }),
        getAllDevices: builder.query<any, void>({
            query: () => "devices",
            providesTags: ['Devices']
        }),
        addDevice: builder.mutation({
            query: (device) => ({
                url: "devices",
                method: "POST",
                body: device
            }),
            invalidatesTags: ['Devices']
        }),
        deleteDevice: builder.mutation({
            query: ({ id }) => ({
                url: `devices/${id}`,
                method: "DELETE",
                body: id
            }),
            invalidatesTags: ['Devices']
        }),
        updateDevice: builder.mutation({
            query: (device) => ({
                url: `devices/${device._id}`,
                method: "PATCH",
                body: device
            }),
            invalidatesTags: ['Devices']
        }),
    })
})
export const { useGetAllGatewaysQuery, useGetGatewayQuery, useAddGatewayMutation, useUpdateGatewayMutation, useDeleteGatewayMutation, useGetAllDevicesQuery, useDeleteDeviceMutation, useUpdateDeviceMutation, useAddDeviceMutation } = gatewaysApiSlice
