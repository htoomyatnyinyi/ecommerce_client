// import { useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useCreateOrderMutation } from "@/redux/query/productApi";
// import { clearCart } from "@/redux/slice/cartSlice";
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

// interface OrderFormData {
//   name: string;
//   address: string;
//   city: string;
//   postalCode: string;
//   country: string;
// }

// const CheckoutOrder = () => {
//   const dispatch = useDispatch();
//   const cartItems = useSelector((state: RootState) => state.cart.items);
//   const [createOrder, { isLoading, isError, error }] = useCreateOrderMutation();
//   const userId = "759094e2-6963-46c7-8445-099f42d84c03"; // Replace with auth user ID

//   // Form state for user details
//   const [formData, setFormData] = useState<OrderFormData>({
//     name: "",
//     address: "",
//     city: "",
//     postalCode: "",
//     country: "",
//   });

//   // Calculate total price
//   const totalPrice = cartItems.reduce((total, item) => {
//     const price = item.variants[0] ? parseFloat(item.variants[0].price) : 0;
//     return total + price * item.quantity;
//   }, 0);

//   // Handle form input changes
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle order submission
//   const handlePlaceOrder = async () => {
//     if (cartItems.length === 0) {
//       alert("Your cart is empty. Add items before placing an order.");
//       return;
//     }

//     if (
//       !formData.name ||
//       !formData.address ||
//       !formData.city ||
//       !formData.postalCode ||
//       !formData.country
//     ) {
//       alert("Please fill in all required fields.");
//       return;
//     }

//     try {
//       await createOrder({ userId }).unwrap();
//       dispatch(clearCart());
//       alert("Order placed successfully!");
//       setFormData({
//         name: "",
//         address: "",
//         city: "",
//         postalCode: "",
//         country: "",
//       });
//     } catch (err) {
//       alert(
//         `Failed to place order: ${
//           (err as any).data?.message || "Unknown error"
//         }`
//       );
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>

//       {cartItems.length === 0 ? (
//         <p className="text-gray-600">
//           Your cart is empty. Add items to proceed with checkout.
//         </p>
//       ) : (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Order Form */}
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">
//               Shipping Details
//             </h2>
//             <div className="space-y-4">
//               <div>
//                 <label
//                   htmlFor="name"
//                   className="block text-gray-700 text-sm font-medium"
//                 >
//                   Full Name
//                 </label>
//                 <input
//                   id="name"
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded-md text-sm"
//                   placeholder="John Doe"
//                   aria-label="Full name"
//                   required
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="address"
//                   className="block text-gray-700 text-sm font-medium"
//                 >
//                   Address
//                 </label>
//                 <input
//                   id="address"
//                   type="text"
//                   name="address"
//                   value={formData.address}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded-md text-sm"
//                   placeholder="123 Main St"
//                   aria-label="Shipping address"
//                   required
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="city"
//                   className="block text-gray-700 text-sm font-medium"
//                 >
//                   City
//                 </label>
//                 <input
//                   id="city"
//                   type="text"
//                   name="city"
//                   value={formData.city}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded-md text-sm"
//                   placeholder="New York"
//                   aria-label="City"
//                   required
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="postalCode"
//                   className="block text-gray-700 text-sm font-medium"
//                 >
//                   Postal Code
//                 </label>
//                 <input
//                   id="postalCode"
//                   type="text"
//                   name="postalCode"
//                   value={formData.postalCode}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded-md text-sm"
//                   placeholder="10001"
//                   aria-label="Postal code"
//                   required
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="country"
//                   className="block text-gray-700 text-sm font-medium"
//                 >
//                   Country
//                 </label>
//                 <input
//                   id="country"
//                   type="text"
//                   name="country"
//                   value={formData.country}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border rounded-md text-sm"
//                   placeholder="United States"
//                   aria-label="Country"
//                   required
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Cart Summary */}
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">
//               Order Summary
//             </h2>
//             <div className="space-y-4">
//               {cartItems.map((item: CartItem) => {
//                 const primaryImage =
//                   item.images.find((img) => img.isPrimary) || item.images[0];
//                 const selectedVariant = item.variants[0];
//                 const itemPrice = selectedVariant
//                   ? parseFloat(selectedVariant.price)
//                   : 0;

//                 return (
//                   <div key={item.id} className="flex gap-4 border-b pb-4">
//                     <div className="flex-shrink-0">
//                       {primaryImage ? (
//                         <img
//                           src={primaryImage.url}
//                           alt={primaryImage.altText}
//                           width={80}
//                           height={80}
//                           className="object-cover rounded-md"
//                         />
//                       ) : (
//                         <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded-md">
//                           <span className="text-gray-500">No Image</span>
//                         </div>
//                       )}
//                     </div>
//                     <div className="flex-1">
//                       <h3 className="text-base font-semibold text-gray-800">
//                         {item.title}
//                       </h3>
//                       {selectedVariant && (
//                         <div className="text-sm text-gray-600">
//                           <p>SKU: {selectedVariant.sku}</p>
//                           <p>Price: ${itemPrice.toFixed(2)}</p>
//                           <p>Quantity: {item.quantity}</p>
//                           {selectedVariant.variantOptions.map((vo) => (
//                             <p key={vo.id} className="capitalize">
//                               {vo.attributeName}: {vo.attributeValue}
//                             </p>
//                           ))}
//                         </div>
//                       )}
//                       <p className="text-sm font-medium text-gray-800 mt-1">
//                         Subtotal: ${(itemPrice * item.quantity).toFixed(2)}
//                       </p>
//                     </div>
//                   </div>
//                 );
//               })}
//               <div className="pt-4 border-t">
//                 <p className="text-lg font-bold text-gray-800">
//                   Total: ${totalPrice.toFixed(2)}
//                 </p>
//               </div>
//               <button
//                 onClick={handlePlaceOrder}
//                 disabled={isLoading}
//                 className={`w-full mt-4 py-2 px-4 rounded-md text-white text-sm ${
//                   isLoading
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-blue-600 hover:bg-blue-700"
//                 } transition-colors`}
//                 aria-label="Place order"
//               >
//                 {isLoading ? "Processing..." : "Place Order"}
//               </button>
//               {isError && (
//                 <p className="text-red-500 text-sm mt-2">
//                   {(error as any).data?.message || "Failed to place order"}
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CheckoutOrder;
