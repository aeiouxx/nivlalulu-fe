import {createApi} from "@reduxjs/toolkit/query/react";
import {customBaseQuery} from "./settings";

export const accountApi = createApi({
    reducerPath: "accountApi",
    baseQuery: customBaseQuery,
    endpoints: (builder) => ({
        changeUsername: builder.mutation({
            query: (newUsername) => ({
                url: "account/username",
                method: "POST",
                body: {newUsername},
            }),
        }),
        changePassword: builder.mutation({
            query: ({oldPassword, newPassword}) => ({
                url: "account/password",
                method: "POST",
                body: {oldPassword, newPassword},
            }),
        }),
        changeEmail: builder.mutation({
            query: (newEmail) => ({
                url: "account/email",
                method: "POST",
                body: {newEmail},
            }),
        }),

        logout: builder.mutation({
            query: () => ({
                url: "account",
                method: "POST",
            }),
        }),

    }),
});

export const {
    useChangeUsernameMutation,
    useChangePasswordMutation,
    useChangeEmailMutation,
    useLogoutMutation,
} = accountApi;
