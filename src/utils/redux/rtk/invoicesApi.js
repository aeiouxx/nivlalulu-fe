import {createApi} from "@reduxjs/toolkit/query/react";
import {customBaseQuery} from "./settings";

export const invoicesApi = createApi({
    reducerPath: "invoices",
    baseQuery: customBaseQuery,
    tagTypes: ['Invoices', 'Invoice'], // Přidání tagu pro jednotlivé faktury
    endpoints: (builder) => ({
        getItems: builder.query({
            query: () => '/invoices',
            providesTags: ['Invoices'], // Propojení se seznamem faktur
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
            invalidatesTags: ['Invoices', {type: 'Invoice', id: id}], // Invaliduje seznam i specifickou fakturu
        }),
    }),
});

export const {
    useGetItemsQuery,
    useGetInvoiceByIdQuery, // Export pro specifickou fakturu
    useCreateInvoiceMutation,
    useDeleteInvoiceMutation,
} = invoicesApi;
