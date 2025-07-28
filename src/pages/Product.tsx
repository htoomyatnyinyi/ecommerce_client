import React, { useState } from "react";
import {
  useGetProductsQuery,
  useGetProductByIdQuery,
} from "@/redux/query/productApi";

const Product: React.FC = () => {
  const [selected, setSelected] = useState<any | null>(null);

  const { data: products } = useGetProductsQuery();
  const { data: productById } = useGetProductByIdQuery(selected, {
    skip: !selected,
  });

  console.log("Selected Product:", productById);
  console.log("All Products:", products);

  return (
    <div>
      {products?.products.map((product: any) => (
        <div
          key={product.id}
          onClick={() => setSelected(product.id)}
          className="cursor-pointer"
        >
          <p>{product.title}</p>
          <p>{product.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Product;
