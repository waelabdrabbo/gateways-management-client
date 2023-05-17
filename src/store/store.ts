import { gatewaysApiSlice } from './features/api/apiSlice';
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query'

export const store = configureStore({
    reducer: {
        [gatewaysApiSlice.reducerPath]: gatewaysApiSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(gatewaysApiSlice.middleware),
})
setupListeners(store.dispatch)
