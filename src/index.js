import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "state";
import { Provider } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { lineaTestnet, polygonZkEvmTestnet } from "wagmi/chains";
import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { injected } from "wagmi/connectors";

const config = createConfig({
  chains: [lineaTestnet, polygonZkEvmTestnet],
  connectors: [injected()],
  transports: {
    [lineaTestnet.id]: http(),
    [polygonZkEvmTestnet.id]: http(),
  },
});

const queryClient = new QueryClient();

const store = configureStore({
  reducer: {
    global: globalReducer,
  },
});
setupListeners(store.dispatch);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </WagmiProvider>
    </Provider>
  </React.StrictMode>
);
