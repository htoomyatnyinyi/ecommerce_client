import { useGetProductsQuery } from "@/redux/query/productApi";
import ProductLists from "./ProductLists";

const Products = () => {
  const { data: products, isLoading: isProductsLoading } =
    useGetProductsQuery();

  return (
    <div className="h-screen">
      <div className="container mx-auto p-8 md:p-4">
        <div className=" ">
          {isProductsLoading ? (
            <div>Loading ...</div>
          ) : (
            <div>
              <ProductLists products={products?.products} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
