import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  id: string; // This should be the variantId
  title: string;
  price: number;
  image?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalQuantity: number;
}

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
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
        existingItem.quantity = existingItem.quantity + newItem.quantity;
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      console.log(action.payload, " at update Quantity");
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
    },
    // clearCart: (state) => {
    //   state.items = [];
    // },
    // You can add more reducers here later (e.g., removeItem, updateQuantity)
  },
});

export const { addItemToCart, removeFromCart, updateQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;
// import { createSlice } from "@reduxjs/toolkit";

// interface CartItem {
//   id: string;
//   quantity: number;
//   name?: string;
//   price?: number;
//   // Add other properties as needed, e.g. name, price, etc.
// }

// interface CartState {
//   items: CartItem[];
// }

// const initialState: CartState = {
//   items: [],
// };

// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     addToCart: (state, action) => {
//       const existingItem = state.items.find(
//         (item) => item.id === action.payload.id
//       );
//       if (existingItem) {
//         existingItem.quantity += 1;
//       } else {
//         state.items.push({ ...action.payload, quantity: 1 });
//       }
//     },
//     removeFromCart: (state, action) => {
//       state.items = state.items.filter((item) => item.id !== action.payload);
//     },
//     updateQuantity: (state, action) => {
//       const { id, quantity } = action.payload;
//       const item = state.items.find((item) => item.id === id);
//       if (item) {
//         item.quantity = quantity;
//       }
//     },
//     clearCart: (state) => {
//       state.items = [];
//     },
//   },
// });

// export const { addToCart, removeFromCart, updateQuantity, clearCart } =
//   cartSlice.actions;

// export default cartSlice.reducer;

// // reducers: {
// // addToCart: (state, action) => {
// //     const existingItem = state.items.find(
// //       (item) => item.id === action.payload.id
// //     );
// //     if (existingItem) {
// //       existingItem.quantity += 1;
// //     } else {
// //       state.items.push({ ...action.payload, quantity: 1 });
// //     }
// //   },
// //   removeFromCart: (state, action) => {
// //     state.items = state.items.filter((item) => item.id !== action.payload);
// //   },
// //   updateQuantity: (state, action) => {
// //     const { id, quantity } = action.payload;
// //     const item = state.items.find((item) => item.id === id);
// //     if (item) {
// //       item.quantity = quantity;
// //     }
// //   },
// //   clearCart: (state) => {
// //     state.items = [];
// //   },
// // },
