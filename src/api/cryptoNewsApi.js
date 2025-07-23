import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const CRYPTO_NEWS_URL = "https://cryptopanic.com/api/developer/v2";

export const cryptoNewsApi = createApi({
    reducerPath: "cryptoNewsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: CRYPTO_NEWS_URL,
        prepareHeaders: (headers) => {
            headers.set("Accept", "application/json");
            return headers;
        },
    }),
    endpoints: () => ({}),
});
