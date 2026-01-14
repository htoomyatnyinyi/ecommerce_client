import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { RootState } from "@/redux/store/store";

import {
  useGetCartQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from "@/redux/query/productApi";

const Cart: React.FC = () => {
  const { isLoading } = useGetCartQuery();

  const { items, totalQuantity, totalPrice } = useSelector(
    (state: RootState) => state.cart
  );

  const result = items.find((item) => item.variant.price > 2000);
  console.log(result, result);

  const [removeCartItem, { isLoading: isRemovingCartItem }] =
    useRemoveCartItemMutation();

  const subtotal = useMemo(() => {
    return items.reduce(
      (total, item) => total + item.variant.price * item.quantity,
      0
    );
  }, [items]);

  const handleRemove = (cartItemId: string) => {
    removeCartItem({ removeCartItemId: cartItemId });
  };

  if (isLoading) {
    return <div className="text-center p-10">Loading cart...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="text-center p-10">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <Link
          to="/products"
          className="bg-blue-600 text-white py-2 px-4 rounded-lg"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
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
                <QuantityUpdater
                  initialQuantity={item.quantity}
                  cartItemId={item.id}
                />
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-red-500 hover:text-red-400"
                >
                  {isRemovingCartItem ? "Removing..." : "Remove"}
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
            <span>{subtotal} MMK</span>
            {/* <span>${subtotal.toFixed(2)}</span> */}
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Backend Price</span>
            <span>{totalPrice} MMK</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Total Quantity</span>
            <span>{totalQuantity}</span>
          </div>
          <div className="border-t pt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{subtotal} MMK</span>
            {/* <span>${subtotal.toFixed(2)}</span> */}
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

interface QuantityProps {
  initialQuantity: number;
  cartItemId: string;
}

const QuantityUpdater: React.FC<QuantityProps> = ({
  initialQuantity,
  cartItemId,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [updateCartItem, { isLoading }] = useUpdateCartItemMutation();

  const handleUpdate = (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
    updateCartItem({ cartItemId, quantity: newQuantity });
  };

  return (
    <div className="flex items-center border rounded-lg">
      <button
        onClick={() => handleUpdate(quantity - 1)}
        className="px-4 py-2 text-lg"
      >
        -
      </button>
      <span className="px-4 py-2 text-lg">
        {isLoading ? "Loading..." : quantity}
      </span>
      <button
        onClick={() => handleUpdate(quantity + 1)}
        className="px-4 py-2 text-lg"
      >
        +
      </button>
    </div>
  );
};

export default Cart;
