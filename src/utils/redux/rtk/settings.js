import {fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const customBaseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:8080/api/v1/',
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
    baseUrl: 'http://localhost:8080/api/public/v1/',
});