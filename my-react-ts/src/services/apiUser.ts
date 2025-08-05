import {createApi} from "@reduxjs/toolkit/query/react";
import {createBaseQuery} from "../utilities/createBaseQuery.ts";
import type {
    IAdminUserItem, ISearchResult, IUserDelete, IUserEdit, IUserSearchParams
} from "./types.ts";
import {serialize} from "object-to-formdata";

export const apiUser = createApi({
    reducerPath: 'api/user',
    baseQuery: createBaseQuery('Users'),
    tagTypes: ['Users', 'User'],
    endpoints: (builder) => ({
        getAllUsers: builder.query<IAdminUserItem[], void>({
            query: () => 'list',
            providesTags: ['Users'],
        }),
        searchUsers: builder.query<ISearchResult<IAdminUserItem>, IUserSearchParams>({
            query: (params) => ({
                url: 'search',
                method: 'POST',
                body: params
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.items.map((u: IAdminUserItem) => ({ type: 'Users' as const, id: u.id })),
                        { type: 'Users', id: 'PARTIAL-LIST' },
                    ]
                    : [{ type: 'Users', id: 'PARTIAL-LIST' }],
        }),
        editUser: builder.mutation<void, IUserEdit>({
            query: (newUser) => {
                try {
                    const formData = serialize(newUser);
                    return {
                        url: 'edit',
                        method: 'PUT',
                        body: formData,
                    };
                } catch {
                    throw new Error('Error Edit user');
                }
            },
            invalidatesTags: ['Users', 'User']
        }),
        getUserById: builder.query<IAdminUserItem, number>({
            query: (id) => `${id}`,
            providesTags: ['User'],
        }),
        deleteUser: builder.mutation<void, IUserDelete>({
            query: (user) => {
                try {
                    return {
                        url: 'delete',
                        method: 'DELETE',
                        body: user
                    };
                } catch {
                    throw new Error('Error delete category');
                }
            },
            invalidatesTags: ['Users'],
        })
    }),
});


export const {
    useGetAllUsersQuery,
    useSearchUsersQuery,
    useEditUserMutation,
    useGetUserByIdQuery,
    useDeleteUserMutation
} = apiUser;