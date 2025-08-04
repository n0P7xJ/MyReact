import {createApi} from "@reduxjs/toolkit/query/react";
import {createBaseQuery} from "../utilities/createBaseQuery.ts";
import type {
    ICity,
    IDeliveryInfoCreate, IGetCitiesRequest, IGetDepartmentsRequest,
    IOrder,
    IPaymentType,
    IPostDepartment
} from "./types.ts";
export const apiOrder = createApi({
    reducerPath: 'api/order',
    baseQuery: createBaseQuery('Order'),
    tagTypes: ['Orders'],
    endpoints: (builder) => ({
        getAllOrders: builder.query<IOrder[], void>({
            query: () => 'list',
            providesTags: ['Orders'],
        }),
        getLastOrderAddress: builder.query<string, void>({
            query: () => ({
                url: `last-order-address`,
                responseHandler: (response) => response.text(),
            }),
            providesTags: ['Orders'],
        }),
        getAllCities: builder.query<ICity[], IGetCitiesRequest>({
            query: (params) => ({
                url: 'cities',
                params,
            }),
        }),
        getAllPostDepartments: builder.query<IPostDepartment[], IGetDepartmentsRequest>({
            query: (params) => ({
                url: 'post-departments',
                params,
            }),
        }),
        getAllPaymentTypes: builder.query<IPaymentType[], void>({
            query: () => 'payment-types',
        }),
        getById: builder.query<IOrder, number>({
            query: (id) => `get/${id}`,
        }),
        createOrder: builder.mutation<void, IDeliveryInfoCreate>({
            query: (obj) => ({
                url: 'create',
                method: 'POST',
                body: obj,
            }),
            invalidatesTags: ['Orders'],
        })
    }),
});


export const {
    useGetAllOrdersQuery,
    useGetByIdQuery,
    useGetLastOrderAddressQuery,
    useCreateOrderMutation,
    useGetAllCitiesQuery,
    useGetAllPaymentTypesQuery,
    useGetAllPostDepartmentsQuery,
} = apiOrder;