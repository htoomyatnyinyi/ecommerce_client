import { useGetCartQuery } from "@/redux/query/productApi";
import React from "react";
import { useSelector } from "react-redux";

const Cart: React.FC = () => {
  const { data: item, isLoading } = useGetCartQuery();

  const { items, totalQuantity } = useSelector((state: any) => state.cart);
  // console.log(items, totalQuantity, "cart check");

  if (isLoading) return <p>Loading</p>;
  console.log(item, "get cart");
  return (
    <div>
      <h1>Add To Cart</h1>
      <p>{totalQuantity}</p>
      <div>
        {items.map((item: any) => (
          <div>
            <p>{item.id}</p>
            <p>{item.title}</p>
            <p>
              {item.price} x {item.quantity}
            </p>
            {/* <p>{item.quantity}</p> */}
            <p>{item.image}</p>
            <img src={item.image} alt="cart" className="h-96 w-96" />
          </div>
        ))}
      </div>

      <div className="p-2 ">
        <h1>From Database Add To Cart</h1>
        {item.map((e: any) => (
          <div key={e.id} className="border p-2 m-1">
            {/* <p>{e.id}</p> */}
            <div>
              {e.items.map((cartItem: any) => (
                <div>
                  <p>Quantity: {cartItem.quantity}</p>
                  <div>
                    <p>{cartItem.product.title}</p>
                    <p>{cartItem.product.description}</p>
                  </div>
                  <div>
                    <p>{cartItem.variant.sku}</p>
                    <p>{cartItem.variant.price}</p>
                    <p>{cartItem.variant.stock}</p>
                    <p>{cartItem.variant.discountPrice}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cart;
