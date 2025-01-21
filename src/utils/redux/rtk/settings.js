import {fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const customBaseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:8080/api/v1/',
    prepareHeaders: (headers, { getState }) => {
        const token = (getState()).auth.accessToken;

        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        return headers;
    },
});