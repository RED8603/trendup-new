import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

import { createAppKit } from "@reown/appkit/react";

import { WagmiProvider } from "wagmi";
import { mainnet } from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { ConfigProvider } from "./context/GenrelContext";
import { Provider } from "react-redux";
import { store } from "./store/srore";
import { BrowserRouter } from "react-router-dom";
import Loading from "@/components/common/loading";

const queryClient = new QueryClient();

const projectId = "a65bc026af82f217afeb8f7543a83113";
// Set the networks
const networks = [mainnet];

//  Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
    networks,
    projectId,
    ssr: true,
    
});

createAppKit({
    adapters: [wagmiAdapter],
    networks,
    projectId,
    features: {
        analytics: true, // Optional - defaults to your Cloud configur ation
    },
});

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <WagmiProvider config={wagmiAdapter.wagmiConfig}>
                <QueryClientProvider client={queryClient}>
                    {" "}
                    <ConfigProvider>
                        <Provider store={store}>
                            <Suspense fallback={<Loading isLoading={true} />}>
                                <App />{" "}
                            </Suspense>
                        </Provider>
                    </ConfigProvider>
                </QueryClientProvider>
            </WagmiProvider>
        </BrowserRouter>
    </StrictMode>
);
