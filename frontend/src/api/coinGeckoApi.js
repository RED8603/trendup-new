import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const CRYPTO_MARKET_URL = "https://api.coingecko.com/api/v3/";

export const cryptoMarketApi = createApi({
    reducerPath: "cryptoMarketApi",
    baseQuery: fetchBaseQuery({
        baseUrl: CRYPTO_MARKET_URL,
        prepareHeaders: (headers) => {
            headers.set("Accept", "application/json");
            return headers;
        },
    }),
    // Keep data fresh - don't cache for too long
    keepUnusedDataFor: 10, // Only cache for 10 seconds
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    endpoints: () => ({}),
});