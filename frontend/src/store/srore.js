import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "@api/baseApi";
import { socialApi } from "@api/slices/socialApi";
import { chatApi } from "@api/slices/chatApi";
import userReducer from "./slices/userSlices";
import chatReducer from "./slices/chatSlice"; 
import { cryptoMarketApi } from "@/api/coinGeckoApi";
import { cryptoNewsApi } from "@/api/cryptoNewsApi";

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        [socialApi.reducerPath]: socialApi.reducer,
        [chatApi.reducerPath]: chatApi.reducer,
        [cryptoMarketApi.reducerPath]: cryptoMarketApi.reducer,
        [cryptoNewsApi.reducerPath]: cryptoNewsApi.reducer,
        user: userReducer,
        chat: chatReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
        baseApi.middleware, // socialApi and chatApi are injected into baseApi, so they use baseApi.middleware
        cryptoMarketApi.middleware, 
        cryptoNewsApi.middleware
    ),
});

setupListeners(store.dispatch);
