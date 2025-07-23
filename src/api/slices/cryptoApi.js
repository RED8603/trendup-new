import { cryptoNewsApi } from "@/api/cryptoNewsApi";

const { VITE_CRYPTOPANIC_TOKEN, VITE_CRYPTOPANIC_BASE_URL } = import.meta.env;

export const cryptoApi = cryptoNewsApi.injectEndpoints({
    endpoints: (builder) => ({
        getCryptoNews: builder.query({
            query: () => ({
                url: `/posts/?auth_token=${VITE_CRYPTOPANIC_TOKEN}&public=true`,
                method: "GET",
            }),
        }),
    }),
});
export const { useGetCryptoNewsQuery } = cryptoApi;
