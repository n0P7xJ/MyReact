import {createApi} from "@reduxjs/toolkit/query/react";
import type {ICategoryCreate, ICategoryDelete, ICategoryEdit, ICategoryItem} from "./types.ts";
import {createBaseQuery} from "../utilities/createBaseQuery.ts";
import {serialize} from "object-to-formdata";


export const apiCategory = createApi({
    reducerPath: 'api/categories',
    baseQuery: createBaseQuery('Categories'),
    tagTypes: ['Category', 'Categories'],
    endpoints: (builder) => ({
        getAllCategories: builder.query<ICategoryItem[], void>({
            query: () => 'list',
            providesTags: ['Categories'],
        }),
        getCategoryBySlug: builder.query<ICategoryItem, string>({
            query: (slug) => `${slug}`,
            providesTags: ['Category'],
        }),
        createCategory: builder.mutation<ICategoryItem, ICategoryCreate>({
            query: (newCategory) => {
                try {
                    const formData = serialize(newCategory);
                    return {
                        url: 'create',
                        method: 'POST',
                        body: formData,
                    };
                } catch {
                    throw new Error('Error Create category');
                }
            },
            invalidatesTags: ['Categories'],
        }),
        editCategory: builder.mutation<ICategoryItem, ICategoryEdit>({
            query: (newCategory) => {
                try {
                    const formData = serialize(newCategory);
                    return {
                        url: 'update',
                        method: 'PUT',
                        body: formData,
                    };
                } catch {
                    throw new Error('Error Edit category');
                }
            },
            invalidatesTags: ['Categories', 'Category'],
        }),
        deleteCategory: builder.mutation<void, ICategoryDelete>({
            query: (deleteCategory) => {
                try {
                    return {
                        url: 'delete',
                        method: 'DELETE',
                        body: deleteCategory
                    };
                } catch {
                    throw new Error('Error delete category');
                }
            },
            invalidatesTags: ['Categories'],
        }),
    }),
});


export const {
    useGetAllCategoriesQuery,
    useCreateCategoryMutation,
    useDeleteCategoryMutation,
    useEditCategoryMutation,
    useGetCategoryBySlugQuery
} = apiCategory;