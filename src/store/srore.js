import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from '@api/baseApi';
import userReducer from './slices/userSlices';
import { cryptoNewsApi } from '@/api/cryptoNewsApi';


export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [cryptoNewsApi.reducerPath]: cryptoNewsApi.reducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware , cryptoNewsApi.middleware)
});

setupListeners(store.dispatch);