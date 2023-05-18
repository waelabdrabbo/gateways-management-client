import { apiSlice } from './features/api/apiSlice';
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query'
export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
})
setupListeners(store.dispatch)
