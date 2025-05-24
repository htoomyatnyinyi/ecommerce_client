import {
  useGetProductsQuery,
  // useGetProductByIdQuery,
} from "@/redux/query/productApi";
import { addToCart } from "@/redux/slice/cartSlice";
import { useDispatch } from "react-redux";

const ProductList = () => {
  const { data: products, error, isLoading } = useGetProductsQuery();
  const dispatch = useDispatch();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: </div>;
  console.log(products, "check at frontedn");

  return (
    <div>
      <h2>Products</h2>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {products?.map((product) => (
          <div
            key={product.id}
            style={{
              margin: "10px",
              border: "1px solid #ccc",
              padding: "10px",
            }}
          >
            <h3>{product.title}</h3>
            <h5>{product.description}</h5>
            <p>${product.price}</p>

            <button
              onClick={() => dispatch(addToCart(product))}
              className="bg-white text-green-500"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
