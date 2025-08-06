import { createSlice } from "@reduxjs/toolkit";
import { productApi } from "../query/productApi";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image?: string;
  quantity: number;
  variant: any;
}

export interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart(state, action: PayloadAction<CartItem>) {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);

      state.totalQuantity = state.totalQuantity + newItem.quantity;

      if (!existingItem) {
        state.items.push({ ...newItem });
      } else {
        existingItem.quantity += newItem.quantity;
      }
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateQuantity(
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
    },
  },

  extraReducers: (builder) => {
    // ✅ when GET /cart is fulfilled, update cart from server
    builder.addMatcher(
      productApi.endpoints.getCart.matchFulfilled,
      (state, action) => {
        // assume server returns { items: CartItem[], totalQuantity: number }
        console.log(action, " at extra Reducer");
        state.items = action.payload.getCart;
        state.totalQuantity = action.payload.totalQuantity;
        state.totalPrice = action.payload.totalPrice;
      }
    );

    builder.addMatcher(
      productApi.endpoints.updateCartItem.matchFulfilled,
      (state, action) => {
        console.log(
          action,
          "at update extra reducer to get quantity and cartItemId"
        );
        // const { id, quantity } = action.meta.arg; // Get id and quantity from the mutation's args
        // const item = state.items.find((item) => item.id === id);
        // if (item) {
        //   item.quantity = quantity; // Update state with the new quantity
        // }
      }
    );

    // ✅ after POST /cart (addToCart), you can optimistically update state
    builder.addMatcher(
      productApi.endpoints.addToCart.matchFulfilled,
      (state, action) => {
        console.log(action, "space");

        // const newItem = action.meta.arg.originalArgs; // because we POSTed this data
        // const existingItem = state.items.find(
        //   (item) => item.id === newItem.variantId
        // );

        // state.totalQuantity += newItem.quantity;

        // console.log(existingItem, "check extra reducer post /cart");

        // if (!existingItem) {
        //   state.items.push({
        //     id: newItem.variantId,
        //     title: "", // fallback if title not provided
        //     price: 0,
        //     quantity: newItem.quantity,
        //   });
        // } else {
        //   existingItem.quantity += newItem.quantity;
        // }
      }
    );
  },
});

export const { addItemToCart, removeFromCart, updateQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;
