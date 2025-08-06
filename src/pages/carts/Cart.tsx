import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import type { RootState } from "@/redux/store/store";
import { removeFromCart, updateQuantity } from "@/redux/slice/cartSlice";
import { useGetCartQuery } from "@/redux/query/productApi";

const Cart: React.FC = () => {
  const dispatch = useDispatch();

  const {} = useGetCartQuery();
  // const { data: carts } = useGetCartQuery();
  // console.log(carts, " atCart components");

  const { items, totalQuantity, totalPrice } = useSelector(
    (state: RootState) => state.cart
  );

  // Calculate subtotal using useMemo for performance
  const subtotal = useMemo(() => {
    return items.reduce(
      (total, item) => total + item.variant.price * item.quantity,
      0
    );
  }, [items]);

  const handleRemove = (variantId: string) => {
    dispatch(removeFromCart(variantId));
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  if (items.length === 0) {
    return (
      <div className="text-center p-10">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <Link to="/" className="bg-blue-600 text-white py-2 px-4 rounded-lg">
          Continue Shopping
        </Link>
        {/* {carts?.getCart.map((cart) => cart.id)} */}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.variant.id}
              className="flex items-center bg-white/5 p-4 rounded-lg"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-24 h-24 object-cover rounded-md mr-4"
              />
              <div className="flex-grow">
                <p className="font-bold">{item.title}</p>
                <p className="text-sm text-gray-400">
                  Size: {item.variant.size}
                </p>
                <p className="font-semibold">${item.variant.price}</p>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(
                      item.variant.id,
                      parseInt(e.target.value, 10)
                    )
                  }
                  className="w-16 p-1 text-center bg-gray-700 rounded"
                  min="1"
                />
                <button
                  onClick={() => handleRemove(item.variant.id)}
                  className="text-red-500 hover:text-red-400"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white/5 p-6 rounded-lg h-fit">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Backend Price</span>
            <span>{totalPrice}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Total Quantity</span>
            <span>{totalQuantity}</span>
          </div>
          <div className="border-t pt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <Link to="/checkout">
            <button className="w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">
              Proceed to Checkout
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
