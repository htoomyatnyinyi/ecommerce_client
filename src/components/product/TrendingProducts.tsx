import React from "react";
import { Link } from "react-router-dom";
import { useGetProductsQuery } from "@/redux/query/productApi";
import { ShoppingCart, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const TrendingProducts: React.FC = () => {
  const { data, isLoading } = useGetProductsQuery();
  const products = data?.data?.products || [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="h-10 w-64 bg-muted animate-pulse rounded mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-square bg-muted animate-pulse rounded-2xl" />
              <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
              <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge
            variant="outline"
            className="mb-4 px-4 py-1 rounded-full border-primary/50 text-primary uppercase tracking-widest text-[10px] font-bold"
          >
            Most Wanted
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Trending <span className="text-primary">Styles</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Our most popular pieces as chosen by the community. Grab yours
            before they're gone.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0, 8).map((product: any) => (
            <div key={product.id} className="group flex flex-col h-full">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted mb-6">
                <Link to={`/products/${product.id}`}>
                  <img
                    src={
                      product.images?.[0]?.url || "https://placehold.co/600x600"
                    }
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </Link>

                {/* Actions Overlay */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full shadow-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </Button>
                  <Button
                    asChild
                    size="icon"
                    variant="secondary"
                    className="rounded-full shadow-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Link to={`/products/${product.id}`}>
                      <Eye className="h-5 w-5" />
                    </Link>
                  </Button>
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4">
                  {product.variants?.[0]?.discountPrice && (
                    <Badge className="bg-destructive text-destructive-foreground font-bold">
                      SALE
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grow space-y-2">
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
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {product.description}
                </p>
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

        <div className="mt-16 text-center">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full px-12 group border-2"
          >
            <Link to="/products">
              View All Products
              <ShoppingCart className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts;
