import { Link } from "react-router-dom";
import { Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ProductLists = ({ products }: { products: any }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20 bg-secondary/10 rounded-[3rem] border border-dashed border-border">
        <p className="text-2xl font-black italic tracking-tighter text-muted-foreground">
          No products found matching your criteria.
        </p>
        <Button
          variant="link"
          className="mt-4 font-bold text-primary underline"
        >
          Clear all filters
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product: any) => (
        <div
          key={product.id}
          className="group flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-muted mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-500">
            <Link to={`/products/${product.id}`}>
              <img
                src={product.images?.[0]?.url || "https://placehold.co/600x800"}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
            </Link>

            {/* Actions Overlay */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
              <Button
                size="lg"
                className="rounded-full shadow-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6"
              >
                Add to Bag
              </Button>
              <Button
                asChild
                size="icon"
                variant="secondary"
                className="rounded-full shadow-2xl h-12 w-12"
              >
                <Link to={`/products/${product.id}`}>
                  <Eye className="h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Badges */}
            <div className="absolute top-6 left-6 flex flex-col gap-2">
              {product.variants?.[0]?.discountPrice && (
                <Badge className="bg-destructive text-destructive-foreground font-black px-3 py-1 rounded-full text-[10px] uppercase tracking-widest">
                  SALE
                </Badge>
              )}
              <Badge
                variant="secondary"
                className="bg-background/80 backdrop-blur-md text-foreground font-black px-3 py-1 rounded-full text-[10px] uppercase tracking-widest border-none"
              >
                NEW
              </Badge>
            </div>
          </div>

          <div className="flex-grow space-y-3 px-4">
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">
                  {product.category?.categoryName || "Premium"}
                </p>
                <Link to={`/products/${product.id}`} className="block">
                  <h3 className="text-2xl font-black italic tracking-tighter hover:text-primary transition-colors line-clamp-1 leading-none">
                    {product.title}
                  </h3>
                </Link>
              </div>
              <div className="flex items-center text-yellow-500 text-sm font-black bg-yellow-500/10 px-2 py-1 rounded-lg">
                <Star className="h-3 w-3 fill-current mr-1" />
                <span>4.9</span>
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              {product.variants?.[0]?.discountPrice ? (
                <>
                  <span className="text-2xl font-black">
                    ${product.variants[0].discountPrice}
                  </span>
                  <span className="text-sm text-muted-foreground line-through decoration-destructive decoration-2">
                    ${product.variants[0].price}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-black">
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

export default ProductLists;
