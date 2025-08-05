import {createApi} from "@reduxjs/toolkit/query/react";
import {createBaseQuery} from "../utilities/createBaseQuery.ts";
import type {ILogin, IRegister, IUserEdit} from "./types.ts";
//import {jwtDecode} from "jwt-decode";
import {serialize} from "object-to-formdata";
import {loginSuccess} from "../store/authSlice.ts";
import {apiCart} from "./apiCart.ts";
import type {Dispatch} from "@reduxjs/toolkit";
import type {RootState} from "../store";
import {clearCart} from "../store/localCartSlice.ts";

export  interface  IForgotPasswordRequest {
    email: string;
}

export  interface IValidateTokenRequest {
    token: string;
    email: string;
}

export  interface IResetPasswordRequest {
    newPassword: string;
    token: string;
    email: string;
}

export interface IChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}

const handleAuthSuccess = async (
    queryFulfilled: Promise<{ data: {token: string} }>,
    dispatch: Dispatch,
    getState: () => RootState
) => {
    try {
        const { data } = await queryFulfilled;
        if (data?.token) {
            dispatch(loginSuccess(data.token));

            const localCart = getState().localCart.items;
            if (localCart.length > 0) {
                await dispatch(apiCart.endpoints.addToCartsRange.initiate(localCart)).unwrap();
            }

            dispatch(clearCart());
        }
    } catch (error) {
        console.error('Auth error:', error);
    }
};

export const apiAccount = createApi({
    reducerPath: 'api/account',
    baseQuery: createBaseQuery('Account'),
    tagTypes: ['Account'],
    endpoints: (builder) => ({
        login: builder.mutation<{token: string}, ILogin>({
            query: (credentials) => ({
                url: 'login',
                method: 'POST',
                body: credentials
            }),
            onQueryStarted: async (_arg, { dispatch, getState, queryFulfilled }) =>
                handleAuthSuccess(queryFulfilled, dispatch, getState)
        }),
        loginByGoogle: builder.mutation<{token: string}, string>({
            query: (token) => ({
                url: 'google-login',
                method: 'POST',
                body: {token}
            }),
            onQueryStarted: async (_arg, { dispatch, getState, queryFulfilled }) =>
                handleAuthSuccess(queryFulfilled, dispatch, getState)
        }),
        forgotPassword: builder.mutation<void, IForgotPasswordRequest>({
            query: (data) => ({
                url: 'forgot-password',
                method: 'POST',
                body: data
            })
        }),
        validateResetToken: builder.query<{isValid: boolean}, IValidateTokenRequest>({
            query: (params) => ({
                url: 'validate-reset-token',
                params
            }),
            providesTags: ['Account']
        }),
        resetPassword: builder.mutation<void, IResetPasswordRequest>({
            query: (data) => ({
                url: 'reset-password',
                method: 'POST',
                body: data
            })
        }),
        changePassword: builder.mutation<void, IChangePasswordRequest>({
            query: (data) => ({
                url: 'change-password',
                method: 'POST',
                body: data
            })
        }),
        register: builder.mutation<{token: string}, IRegister>({
            query: (credentials) => {
                const formData = serialize(credentials);

                return{
                    url: 'register',
                    method: 'POST',
                    body: formData};
            }
        }),
        deleteAccount: builder.mutation<void, void>({
            query: () => {
                return{
                    url: 'delete',
                    method: 'DELETE',};
            }
        }),
        editAccount: builder.mutation<{token : string}, IUserEdit>({
            query: (credentials) => {
                const formData = serialize(credentials);

                return{
                    url: 'edit',
                    method: 'PUT',
                    body: formData,
                };
            }
        }),
    })
});

export const {
    useLoginMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useValidateResetTokenQuery,
    useRegisterMutation,
    useChangePasswordMutation,
    useLoginByGoogleMutation,
    useDeleteAccountMutation,
    useEditAccountMutation,
} = apiAccount;