import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const CRYPTO_NEWS_URL = "https://cryptopanic.com/api/developer/v2";
const { VITE_CRYPTOPANIC_TOKEN } = import.meta.env;

// Create base query
const baseQuery = fetchBaseQuery({
    baseUrl: CRYPTO_NEWS_URL,
    prepareHeaders: (headers) => {
        headers.set("Accept", "application/json");
        return headers;
    },
});

// Custom base query with error handling for CORS and rate limiting
const baseQueryWithErrorHandling = async (args, api, extraOptions) => {
    try {
        const result = await baseQuery(args, api, extraOptions);

        if (result.error) {
            console.error('Crypto News API Error:', result.error);
            return {
                error: {
                    status: result.error.status || 'FETCH_ERROR',
                    data: {
                        message: 'Failed to fetch crypto news',
                        originalError: result.error
                    }
                }
            };
        }

        return result;
    } catch (error) {
        console.error('Crypto News Unexpected Error:', error);
        return {
            error: {
                status: 'UNKNOWN_ERROR',
                data: {
                    message: 'Unexpected error occurred',
                    originalError: error.message
                }
            }
        };
    }
};

export const cryptoNewsApi = createApi({
    reducerPath: "cryptoNewsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1'}/news`
    }),
    endpoints: (builder) => ({
        getCryptoNews: builder.query({
            query: () => `/crypto`,
            keepUnusedDataFor: 300,
        }),
    }),
});

export const { useGetCryptoNewsQuery } = cryptoNewsApi;