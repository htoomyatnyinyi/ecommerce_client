import { useGetProductsQuery } from "@/redux/query/productApi";
import ProductLists from "./ProductLists";

const Products = () => {
  const { data: products, isLoading: isProductsLoading } =
    useGetProductsQuery();

  return (
    <div className="h-screen">
      <div className="container mx-auto">
        <div className="flex ">
          {isProductsLoading ? (
            <div>Loading ...</div>
          ) : (
            <div>
              <h1>title</h1>
              <ProductLists products={products?.products} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
