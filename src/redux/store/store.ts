import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "../query/authApi";
import { productApi } from "../query/productApi";
import { orderApi } from "../query/orderApi";
import { userApi } from "../query/userApi";
import cartReducer from "../slice/cartSlice";
import orderReducer from "../slice/orderSlice";
import searchReducer from "../slice/searchSlice";

import { dashboardApi } from "../query/dashboardApi";

export const store = configureStore({
  reducer: {
    search: searchReducer,
    cart: cartReducer,
    order: orderReducer,
    [productApi.reducerPath]: productApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(dashboardApi.middleware)
      .concat(productApi.middleware)
      .concat(orderApi.middleware)
      .concat(userApi.middleware),
});

// Add RootState type
setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
