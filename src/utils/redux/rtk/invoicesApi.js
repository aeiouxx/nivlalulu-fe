import {createApi} from "@reduxjs/toolkit/query/react";
import {customBaseQuery} from "./settings";

export const invoicesApi = createApi({
    reducerPath: "invoices",
    baseQuery: customBaseQuery,
    tagTypes: ['Invoices', 'Invoice'], // Přidání tagu pro jednotlivé faktury
    endpoints: (builder) => ({
        getItems: builder.query({
            query: () => '/invoices',
            providesTags: ['Invoices'],
        }),
        getAllFilteredInvoices: builder.query({
            query: (searchDto) => {
                const queryString = new URLSearchParams(searchDto).toString();
                return {
                    url: `/invoices/search?${queryString}`,
                    method: 'GET',
                };
            },
            keepUnusedDataFor: 0,
        }),
        getInvoiceById: builder.query({
            query: (id) => ({
                url: `/invoices/${id}`,
            }),
            providesTags: (result, error, id) => [{type: 'Invoice', id}], // Propojení se specifickou fakturou
        }),
        createInvoice: builder.mutation({
            query: (fieldsObj) => ({
                url: '/invoices',
                method: 'POST',
                body: fieldsObj,
            }),
            invalidatesTags: ['Invoices'], // Invaliduje seznam faktur
        }),
        deleteInvoice: builder.mutation({
            query: (id) => ({
                url: `/invoices/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => ['Invoices', {type: 'Invoice', id}], // Invaliduje seznam i specifickou fakturu
        }),
        updateInvoice: builder.mutation({
            query: ({id, fieldsObj}) => ({
                url: `/invoices/${id}`,
                method: "PUT",
                body: fieldsObj,
            }),
            invalidatesTags: (result, error, {id}) => [{type: 'Invoice', id}], // Invaliduje cache specifické faktury
        }),
    }),
});

export const {
    useGetItemsQuery,
    useGetAllFilteredInvoicesQuery,
    useGetInvoiceByIdQuery, // Export pro specifickou fakturu
    useCreateInvoiceMutation,
    useDeleteInvoiceMutation,
    useUpdateInvoiceMutation, // Export pro úpravu faktury
} = invoicesApi;
