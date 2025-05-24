// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { productApi } from "../query/productApi";
import cartReducer from "../slice/cartSlice";
import orderReducer from "../slice/orderSlice";
import themeReducer from "../slice/themeSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    order: orderReducer,
    theme: themeReducer,
    [productApi.reducerPath]: productApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productApi.middleware),
});

setupListeners(store.dispatch);
