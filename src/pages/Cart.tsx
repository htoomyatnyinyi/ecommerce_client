import { useSelector, useDispatch } from "react-redux";
import {
  clearCart,
  removeFromCart,
  updateQuantity,
} from "@/redux/slice/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  // console.log(cartItems, "check =");
  // const  a = cartItems.reduce

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div>
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cartItems.map((item: any) => (
            <div key={item.id} className="p-2 m-1 border">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p>{item.quantity}: originam one</p>
              <div>
                {item.variants.map((v: any) => (
                  <div className="p-2 m-1 border" key={v.id}>
                    <div>sku : {v.sku}</div>
                    <div>stock : {v.stock}</div>
                    <div>price : {v.price}</div>
                    <div className="p-2 m-1 border">
                      {v.variantOptions.map((vo: any) => (
                        <div key={vo.id} className="p-2 m-1 border">
                          {vo.attributeName} : {vo.attributeValue}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {/* <p>Price: ${item.price}</p> */}
              <div>
                {item.images.map((e: any) => (
                  <div key={e.id} className="flex p-2 m-1 ">
                    <div>
                      {e.isPrimary && (
                        <img
                          src={e.url}
                          alt={e.altText}
                          width={50}
                          height={50}
                        />
                      )}
                    </div>
                    <img src={e.url} alt={e.altText} width={50} height={50} />
                  </div>
                ))}
              </div>
              <p>
                Quantity:
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    dispatch(
                      updateQuantity({
                        id: item.id,
                        quantity: parseInt(e.target.value),
                      })
                    )
                  }
                  min="1"
                  className="m-1 "
                />
              </p>
              <button
                onClick={() => dispatch(removeFromCart(item.id))}
                className="border p-2 m-1"
              >
                Remove
              </button>
            </div>
          ))}
          <h3>Total: ${totalPrice.toFixed(2)}</h3>
          <button onClick={() => dispatch(clearCart())}>Clear Cart</button>
        </>
      )}
    </div>
  );
};

export default Cart;
