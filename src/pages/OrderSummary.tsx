import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { placeOrder } from "@/redux/slice/orderSlice";
import { clearCart } from "@/redux/slice/cartSlice";
import { useNavigate } from "react-router-dom";

interface RootState {
  cart: {
    items: {
      id: number | string;
      title: string;
      price: number;
      quantity: number;
    }[];
  };
}

const OrderSummary: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = () => {
    const order = {
      id: Date.now(), // Temporary ID; replace with backend-generated ID
      items: cartItems,
      total: totalPrice,
      date: new Date().toISOString(),
    };
    dispatch(placeOrder(order));
    dispatch(clearCart());
    navigate("/order-confirmation");
  };

  return (
    <div>
      <h2>Order Summary</h2>
      {cartItems.map((item) => (
        <div key={item.id}>
          <p>
            {item.title} - ${item.price} x {item.quantity}
          </p>
        </div>
      ))}
      <h3>Total: ${totalPrice.toFixed(2)}</h3>
      <button onClick={handlePlaceOrder}>Place Order</button>
    </div>
  );
};

export default OrderSummary;
