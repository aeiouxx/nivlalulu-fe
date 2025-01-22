import {fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const customBaseQuery = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL_PRIVATE,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = (getState()).auth.accessToken.content;

        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        return headers;
    },
});

export const publicBaseQuery = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL_PUBLIC,
});