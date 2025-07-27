import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from '@api/baseApi';
import userReducer from './slices/userSlices';
import { cryptoNewsApi } from '@/api/cryptoNewsApi';
import { cryptoMarketApi } from '@/api/coinGeckoApi';


export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [cryptoNewsApi.reducerPath]: cryptoNewsApi.reducer,
    [cryptoMarketApi.reducerPath]: cryptoMarketApi.reducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware , cryptoNewsApi.middleware , cryptoMarketApi.middleware),
});

setupListeners(store.dispatch);