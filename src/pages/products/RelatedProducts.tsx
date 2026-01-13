import React from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  title: string;
  description?: string;
  images: { url: string; altText: string }[];
  variants?: { price: number; discountPrice?: number }[];
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
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-4 animate-pulse">
            <div className="aspect-square bg-muted rounded-3xl" />
            <div className="h-6 w-3/4 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  const relatedProducts = allProducts
    ?.filter((p) => p.id !== currentProductId)
    .slice(0, 4);

  if (!relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {relatedProducts.map((product) => (
        <div key={product.id} className="group flex flex-col h-full">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted mb-6">
            <Link to={`/products/${product.id}`}>
              <img
                src={product.images?.[0]?.url || "https://placehold.co/600x600"}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </Link>

            <div className="absolute top-4 left-4">
              {product.variants?.[0]?.discountPrice && (
                <Badge className="bg-destructive text-destructive-foreground font-bold">
                  SALE
                </Badge>
              )}
            </div>
          </div>

          <div className="flex-grow space-y-2">
            <div className="flex justify-between items-start">
              <Link to={`/products/${product.id}`} className="block">
                <h3 className="text-xl font-bold hover:text-primary transition-colors line-clamp-1">
                  {product.title}
                </h3>
              </Link>
              <div className="flex items-center text-yellow-500 text-sm font-bold">
                <Star className="h-4 w-4 fill-current mr-1" />
                <span>4.9</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2 pt-2">
              {product.variants?.[0]?.discountPrice ? (
                <>
                  <span className="text-xl font-bold">
                    ${product.variants[0].discountPrice}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.variants[0].price}
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold">
                  ${product.variants?.[0]?.price || "0.00"}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RelatedProducts;
