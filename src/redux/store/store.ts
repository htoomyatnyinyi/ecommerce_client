// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "../query/authApi";
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
    [authApi.reducerPath]: authApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(productApi.middleware),
});

// Add RootState type
setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
