import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "@api/baseApi";
import userReducer from "./slices/userSlices";
import { cryptoMarketApi } from "@/api/coinGeckoApi";
import { cryptoNewsApi } from "@/api/cryptoNewsApi";

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        [cryptoMarketApi.reducerPath]: cryptoMarketApi.reducer,
        [cryptoNewsApi.reducerPath]: cryptoNewsApi.reducer,
        user: userReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware, cryptoMarketApi.middleware , cryptoNewsApi.middleware),
});

setupListeners(store.dispatch);
