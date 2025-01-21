import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import {setupListeners} from "@reduxjs/toolkit/query";
import logger from 'redux-logger';
import {invoicesApi} from "./rtk/invoicesApi";

const store = configureStore({
    reducer: {
        auth: authReducer,
        [invoicesApi.reducerPath]: invoicesApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(invoicesApi.middleware)
    //.concat(logger),
});

setupListeners(store.dispatch);

export default store;