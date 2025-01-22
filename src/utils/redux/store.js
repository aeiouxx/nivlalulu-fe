import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import {setupListeners} from "@reduxjs/toolkit/query";
import {invoicesApi} from "./rtk/invoicesApi";
import {accountApi} from "./rtk/accountApi";
import {authApi} from "./rtk/publicApi";

const store = configureStore({
    reducer: {
        auth: authReducer,
        [invoicesApi.reducerPath]: invoicesApi.reducer,
        [accountApi.reducerPath]: accountApi.reducer,
        [authApi.reducerPath]: authApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(invoicesApi.middleware).concat(accountApi.middleware).concat(authApi.middleware)
    //.concat(logger),
});

setupListeners(store.dispatch);

export default store;