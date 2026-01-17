import { createSlice } from "@reduxjs/toolkit";
import { productApi } from "../query/productApi";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string; // Unique for the cart entry (variantId usually)
  productId: string;
  variantId: string;
  title: string;
  image: string;
  quantity: number;
  variant: {
    id: string;
    size: string;
    price: number;
    discountPrice?: number;
  };
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
    // Local optimistic update
    addItemToCart(state, action: PayloadAction<Omit<CartItem, "id">>) {
      const newItem = action.payload;
      const existingItem = state.items.find(
        (item) => item.variantId === newItem.variantId
      );

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        // Temporary ID for local state until synced with server
        state.items.push({ ...newItem, id: newItem.variantId });
      }

      // We'll let the server sync handle the absolute totals,
      // but we can update them here for immediate feedback if needed.
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
    // ✅ Synchronize with server cart response
    builder.addMatcher(
      productApi.endpoints.getCart.matchFulfilled,
      (state, action) => {
        const {
          items: serverCart,
          totalQuantity,
          totalPrice,
        } = action.payload.data;

        // Map server Prisma structure to our UI structure
        state.items = serverCart.map((item: any) => ({
          id: item.id,
          productId: item.productId,
          variantId: item.variantId,
          title: item.product.title,
          image: item.product.images?.[0]?.url || "",
          quantity: item.quantity,
          variant: {
            id: item.variant.id,
            size: item.variant.size,
            price: item.variant.price,
            discountPrice: item.variant.discountPrice,
          },
        }));

        state.totalQuantity = totalQuantity;
        state.totalPrice = totalPrice;
      }
    );
  },
});

export const { addItemToCart, removeFromCart, updateQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;
