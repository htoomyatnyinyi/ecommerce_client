// import React from "react";

// const Checkout: React.FC = () => {
//   return <div>Checkout</div>;
// };

// export default Checkout;

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { clearCart } from "@/redux/slice/cartSlice";
import type { RootState } from "@/redux/store/store";

const Checkout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state: RootState) => state.cart);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Your cart is empty!");
      navigate("/cart");
      return;
    }
    // In a real app, you would send this data to a backend API
    console.log("Order Placed:", {
      customer: formData,
      order: items,
      total: items.reduce(
        (sum, item) => sum + item.variant.price * item.quantity,
        0
      ),
    });

    // Clear the cart and navigate to a success page or homepage
    // dispatch(clearCart());
    alert("Thank you for your order!");
    navigate("/");
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-white/5 p-8 rounded-lg"
      >
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleInputChange}
            className="w-full p-3 bg-gray-700 rounded"
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            onChange={handleInputChange}
            className="w-full p-3 bg-gray-700 rounded"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Street Address"
            onChange={handleInputChange}
            className="w-full p-3 bg-gray-700 rounded"
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            onChange={handleInputChange}
            className="w-full p-3 bg-gray-700 rounded"
            required
          />
          <input
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            onChange={handleInputChange}
            className="w-full p-3 bg-gray-700 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default Checkout;
