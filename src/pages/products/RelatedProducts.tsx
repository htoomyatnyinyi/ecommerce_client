import React from "react";
import { Link } from "react-router-dom";

// You should define a proper type for your product object
interface Product {
  id: string;
  title: string;
  images: { url: string; altText: string }[];
}

interface RelatedProductsProps {
  allProducts: Product[];
  currentProductId: string;
  isLoading: boolean;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  allProducts,
  currentProductId,
  isLoading,
}) => {
  if (isLoading) return <p>Loading related products...</p>;

  // Filter out the current product from the list
  const relatedProducts = allProducts
    ?.filter((p) => p.id !== currentProductId)
    .slice(0, 5); // Show up to 5

  return (
    <div className="border-t pt-8 mt-8">
      <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {relatedProducts?.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-3 bg-white/5 text-center"
          >
            <Link to={`/products/${product.id}`}>
              <img
                src={product.images[0]?.url}
                alt={product.images[0]?.altText}
                className="h-40 w-full object-cover rounded-md mb-2"
              />
              <p className="font-semibold">{product.title}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
