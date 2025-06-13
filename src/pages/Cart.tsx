import { useGetCartQuery } from "@/redux/query/productApi";
import React from "react";

const Cart: React.FC = () => {
  const { data: carts, isLoading: isGetCartLoading } = useGetCartQuery();

  console.log(carts, "check");

  return (
    <div>
      {isGetCartLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {carts?.map((cart: any) => (
            <div key={cart.id}>
              <p>{cart.id}</p>
              <div>
                {cart.items?.map((q: any) => (
                  <div key={q.id}>
                    {q.id}
                    <CartItem item={q} />
                  </div>
                ))}
              </div>
              <CartSummary items={cart.items || []} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;

const CartItem = ({ item }: { item: any }) => {
  const { product, variant, quantity } = item;

  return (
    <div className="p-2 m-1 border">
      <div className="bg-slate-200 p-2">
        <h3>{product.title}</h3>
        <p>SKU: {variant.sku}</p>
        <p>Price: ${variant.price}</p>
        <p>Quantity: {quantity}</p>
      </div>
      <div className="text-xl">
        <p>Total: ${(variant.price * quantity).toFixed(2)}</p>
      </div>
    </div>
  );
};

const CartSummary = ({ items }: { items: any }) => {
  const subtotal = items.reduce((acc: number, item: any) => {
    return acc + item.variant.price * item.quantity;
  }, 0);

  const tax = subtotal * 0.1; // Example 10% tax
  const total = subtotal + tax;

  return (
    <div className="p-2 m-1 border">
      <h3>Order Summary</h3>
      <div className="summary-row">
        <span>Subtotal:</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div className="summary-row">
        <span>Tax (10%):</span>
        <span>${tax.toFixed(2)}</span>
      </div>
      <div className="summary-row total">
        <span>Total:</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
};

// import { useSelector, useDispatch } from "react-redux";
// import {
//   clearCart,
//   removeFromCart,
//   updateQuantity,
// } from "@/redux/slice/cartSlice";
// import type { RootState } from "@/redux/store/store";

// interface VariantOption {
//   id: string;
//   attributeName: string;
//   attributeValue: string;
//   variantId: string;
// }

// interface Variant {
//   id: string;
//   sku: string;
//   price: string;
//   stock: number;
//   createdAt: string;
//   updatedAt: string;
//   productId: string;
//   variantOptions: VariantOption[];
// }

// interface Image {
//   id: string;
//   url: string;
//   altText: string;
//   isPrimary: boolean;
//   createdAt: string;
//   updatedAt: string;
//   productId: string;
// }

// interface CartItem {
//   id: string;
//   title: string;
//   description: string;
//   createdAt: string;
//   updateAt: string;
//   userId: string;
//   categoryId: string | null;
//   brandId: string | null;
//   variants: Variant[];
//   images: Image[];
//   category: string | null;
//   brand: string | null;
//   quantity: number;
// }

// const Cart = () => {
//   const dispatch = useDispatch();
//   const cartItems = useSelector((state: RootState) => state.cart.items);
//   console.log(cartItems, "check =");

//   // Calculate total price using the first variant's price
//   const totalPrice = cartItems.reduce((total, item) => {
//     const price = item.variants[0] ? parseFloat(item.variants[0].price) : 0;
//     return total + price * item.quantity;
//   }, 0);

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h2 className="text-2xl font-bold text-gray-800 mb-4">Shopping Cart</h2>
//       {cartItems.length === 0 ? (
//         <p className="text-gray-600">Your cart is empty</p>
//       ) : (
//         <>
//           {cartItems.map((item: CartItem) => {
//             const primaryImage =
//               item.images.find((img) => img.isPrimary) || item.images[0];
//             const selectedVariant = item.variants[0]; // Use first variant for pricing
//             const itemPrice = selectedVariant
//               ? parseFloat(selectedVariant.price)
//               : 0;

//             return (
//               <div
//                 key={item.id}
//                 className="p-4 m-2 border rounded-lg shadow-sm bg-white"
//               >
//                 <div className="flex flex-col sm:flex-row gap-4">
//                   {/* Image */}
//                   <div className="flex-shrink-0">
//                     {primaryImage ? (
//                       <img
//                         src={primaryImage.url}
//                         alt={primaryImage.altText}
//                         width={100}
//                         height={100}
//                         className="object-cover rounded-md"
//                       />
//                     ) : (
//                       <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded-md">
//                         <span className="text-gray-500">No Image</span>
//                       </div>
//                     )}
//                   </div>

//                   {/* Details */}
//                   <div className="flex-1">
//                     <h3 className="text-lg font-semibold text-gray-800">
//                       {item.title}
//                     </h3>
//                     <p className="text-gray-600 text-sm line-clamp-2">
//                       {item.description}
//                     </p>
//                     {selectedVariant && (
//                       <div className="mt-2">
//                         <p className="text-sm text-gray-700">
//                           SKU: {selectedVariant.sku}
//                         </p>
//                         <p className="text-sm text-gray-700">
//                           Price: ${itemPrice.toFixed(2)}
//                         </p>
//                         <p className="text-sm text-gray-700">
//                           Stock: {selectedVariant.stock}
//                         </p>
//                         <div className="mt-1">
//                           {selectedVariant.variantOptions.map((vo) => (
//                             <p
//                               key={vo.id}
//                               className="text-sm text-gray-600 capitalize"
//                             >
//                               {vo.attributeName}: {vo.attributeValue}
//                             </p>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                     <p className="mt-2 text-sm text-gray-700">
//                       Subtotal: ${(itemPrice * item.quantity).toFixed(2)}
//                     </p>
//                   </div>

//                   {/* Quantity and Actions */}
//                   <div className="flex flex-col items-end gap-2">
//                     <div className="flex items-center">
//                       <label
//                         htmlFor={`quantity-${item.id}`}
//                         className="mr-2 text-sm text-gray-700"
//                       >
//                         Quantity:
//                       </label>
//                       <input
//                         id={`quantity-${item.id}`}
//                         type="number"
//                         value={item.quantity}
//                         onChange={(e) => {
//                           const newQuantity = parseInt(e.target.value);
//                           if (newQuantity >= 1) {
//                             dispatch(
//                               updateQuantity({
//                                 id: item.id,
//                                 quantity: newQuantity,
//                               })
//                             );
//                           }
//                         }}
//                         min="1"
//                         className="w-16 p-1 border rounded-md text-sm"
//                         aria-label={`Quantity for ${item.title}`}
//                       />
//                     </div>
//                     <button
//                       onClick={() => dispatch(removeFromCart(item.id))}
//                       className="text-red-500 hover:text-red-700 text-sm font-medium"
//                       aria-label={`Remove ${item.title} from cart`}
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//           <div className="mt-6 p-4 border rounded-lg bg-gray-50">
//             <h3 className="text-lg font-bold text-gray-800">
//               Total: ${totalPrice.toFixed(2)}
//             </h3>
//             <div className="mt-4 flex gap-4">
//               <button
//                 onClick={() => dispatch(clearCart())}
//                 className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
//                 aria-label="Clear cart"
//               >
//                 Clear Cart
//               </button>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Cart;

// // import { useSelector, useDispatch } from "react-redux";
// // import {
// //   clearCart,
// //   removeFromCart,
// //   updateQuantity,
// // } from "@/redux/slice/cartSlice";
// // import type { RootState } from "@/redux/store/store";

// // const Cart = () => {
// //   const dispatch = useDispatch();
// //   const cartItems = useSelector((state: RootState) => state.cart.items);
// //   console.log(cartItems, "check =");
// //   // const  a = cartItems.reduce

// //   // const totalPrice = cartItems.reduce(
// //   //   (total, item) => total + item.price * item.quantity,
// //   //   0
// //   // );
// // const totalPrice = cartItems.reduce((total, item) => {
// //   const price = item.variants[0] ? parseFloat(item.variants[0].price) : 0;
// //   return total + price * item.quantity;
// // }, 0);
// //   return (
// //     <div>
// //       <h2>Shopping Cart</h2>
// //       {cartItems.length === 0 ? (
// //         <p>Your cart is empty</p>
// //       ) : (
// //         <>
// //           {cartItems.map((item: any) => (
// //             <div key={item.id} className="p-2 m-1 border">
// //               <h3>{item.title}</h3>
// //               <p>{item.description}</p>
// //               <p>{item.quantity}: originam one</p>
// //               <div>
// //                 {item.variants.map((v: any) => (
// //                   <div className="p-2 m-1 border" key={v.id}>
// //                     <div>sku : {v.sku}</div>
// //                     <div>stock : {v.stock}</div>
// //                     <div>price : {v.price}</div>
// //                     <div className="p-2 m-1 border">
// //                       {v.variantOptions.map((vo: any) => (
// //                         <div key={vo.id} className="p-2 m-1 border">
// //                           {vo.attributeName} : {vo.attributeValue}
// //                         </div>
// //                       ))}
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //               {/* <p>Price: ${item.price}</p> */}
// //               <div>
// //                 {item.images.map((e: any) => (
// //                   <div key={e.id} className="flex p-2 m-1 ">
// //                     <div>
// //                       {e.isPrimary && (
// //                         <img
// //                           src={e.url}
// //                           alt={e.altText}
// //                           width={50}
// //                           height={50}
// //                         />
// //                       )}
// //                     </div>
// //                     <img src={e.url} alt={e.altText} width={50} height={50} />
// //                   </div>
// //                 ))}
// //               </div>
// //               <p>
// //                 Quantity:
// //                 <input
// //                   type="number"
// //                   value={item.quantity}
// //                   onChange={(e) =>
// //                     dispatch(
// //                       updateQuantity({
// //                         id: item.id,
// //                         quantity: parseInt(e.target.value),
// //                       })
// //                     )
// //                   }
// //                   min="1"
// //                   className="m-1 "
// //                 />
// //               </p>
// //               <button
// //                 onClick={() => dispatch(removeFromCart(item.id))}
// //                 className="border p-2 m-1"
// //               >
// //                 Remove
// //               </button>
// //             </div>
// //           ))}
// //           {/* <h3>Total: ${totalPrice.toFixed(2)}</h3> */}
// //           <button onClick={() => dispatch(clearCart())}>Clear Cart</button>
// //         </>
// //       )}
// //     </div>
// //   );
// // };

// // export default Cart;
