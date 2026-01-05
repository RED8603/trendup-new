import { cryptoMarketApi } from "../coinGeckoApi";

const ids = "bitcoin,ethereum,solana,dogecoin,binancecoin,cardano,polkadot,tron,chainlink,polygon,litecoin,uniswap";
const vsCurrencies = "usd";

export const cryptoApi = cryptoMarketApi.injectEndpoints({
    endpoints: (builder) => ({
        getCryptoMarket: builder.query({
            query: () => ({
                url: `simple/price?ids=${ids}&vs_currencies=${vsCurrencies}&include_24hr_change=true`,
                method: "GET",
            }),
            // Force refetch on each subscription
            keepUnusedDataFor: 5,
        }),
    }),
});

export const { useGetCryptoMarketQuery } = cryptoApi;
