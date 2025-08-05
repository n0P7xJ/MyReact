import {configureStore} from "@reduxjs/toolkit";
import {apiCategory} from "../services/apiCategory.ts";
import {apiAccount} from "../services/apiAccount.ts";
import  authReducer from "../store/authSlice.ts";
import {type TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {apiProduct} from "../services/apiProduct.ts";
import {apiUser} from "../services/apiUser.ts";
import userSearchReducer from '../store/userSearchSlice.ts';
import {apiCart} from "../services/apiCart.ts";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import {apiOrder} from "../services/apiOrder.ts";
import localCarReducer from './localCartSlice.ts';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        userSearch: userSearchReducer,
        localCart: localCarReducer,
        [apiCategory.reducerPath]: apiCategory.reducer,
        [apiAccount.reducerPath]: apiAccount.reducer,
        [apiProduct.reducerPath]: apiProduct.reducer,
        [apiUser.reducerPath]: apiUser.reducer,
        [apiCart.reducerPath]: apiCart.reducer,
        [apiOrder.reducerPath]: apiOrder.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(apiCategory.middleware,
            apiAccount.middleware,
            apiProduct.middleware,
            apiUser.middleware,
            apiCart.middleware,
            apiOrder.middleware)
})

setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector