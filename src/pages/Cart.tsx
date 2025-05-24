const Cart = () => {
  return <div>Cart</div>;
};

export default Cart;
// // src/components/Cart.js
// import { useSelector, useDispatch } from "react-redux";
// import {
//   removeFromCart,
//   updateQuantity,
//   clearCart,
// } from "../features/cartSlice";

// const Cart = () => {
//   const cartItems = useSelector((state) => state.cart.items);
//   const dispatch = useDispatch();

//   const totalPrice = cartItems.reduce(
//     (total, item) => total + item.price * item.quantity,
//     0
//   );

//   return (
//     <div>
//       <h2>Shopping Cart</h2>
//       {cartItems.length === 0 ? (
//         <p>Your cart is empty</p>
//       ) : (
//         <>
//           {cartItems.map((item) => (
//             <div
//               key={item.id}
//               style={{
//                 margin: "10px",
//                 border: "1px solid #ccc",
//                 padding: "10px",
//               }}
//             >
//               <h3>{item.name}</h3>
//               <p>Price: ${item.price}</p>
//               <p>
//                 Quantity:
//                 <input
//                   type="number"
//                   value={item.quantity}
//                   onChange={(e) =>
//                     dispatch(
//                       updateQuantity({
//                         id: item.id,
//                         quantity: parseInt(e.target.value),
//                       })
//                     )
//                   }
//                   min="1"
//                 />
//               </p>
//               <button onClick={() => dispatch(removeFromCart(item.id))}>
//                 Remove
//               </button>
//             </div>
//           ))}
//           <h3>Total: ${totalPrice.toFixed(2)}</h3>
//           <button onClick={() => dispatch(clearCart())}>Clear Cart</button>
//         </>
//       )}
//     </div>
//   );
// };

// export default Cart;
