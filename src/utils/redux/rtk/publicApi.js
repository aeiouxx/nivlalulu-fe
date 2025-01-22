import { createApi } from "@reduxjs/toolkit/query/react";
import {publicBaseQuery} from "./settings";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: publicBaseQuery,
    endpoints: (builder) => ({
        register: builder.mutation({
            query: ({ username, email, password }) => ({
                url: "auth/register",
                method: "POST",
                body: { username, email, password },
            }),
        }),
        login: builder.mutation({
            query: ({ username, password }) => ({
                url: "auth/login",
                method: "POST",
                body: { username, password },
            }),
        }),
        refreshToken: builder.mutation({
            query: () => ({
                url: "token/refresh",
                method: "POST",
            }),
        }),
        requestPasswordReset: builder.mutation({
            query: (username) => ({
                url: "password-reset/request",
                method: "POST",
                body: { username },
            }),
        }),
        confirmPasswordReset: builder.mutation({
            query: ({ token, newPassword }) => ({
                url: "password-reset/confirm",
                method: "POST",
                body: { token, newPassword },
            }),
        }),
    }),
});

// Export mutací pro použití v komponentách
export const {
    useRegisterMutation,
    useLoginMutation,
    useRefreshTokenMutation,
    useRequestPasswordResetMutation,
    useConfirmPasswordResetMutation,
} = authApi;