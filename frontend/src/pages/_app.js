import { Provider } from "react-redux";
import React from "react";

import { store } from "@/config/redux/store";
export default function App({ Component, pageProps }) {
  return (
    <>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}
