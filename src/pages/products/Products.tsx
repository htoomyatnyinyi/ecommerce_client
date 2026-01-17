import {
  useGetProductsQuery,
  useGetCategoryQuery,
} from "@/redux/query/productApi";
import ProductLists from "./ProductLists";
import { Badge } from "@/components/ui/badge";
import { Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Products = () => {
  const { data: productsData, isLoading: isProductsLoading } =
    useGetProductsQuery();
  const { data: categories } = useGetCategoryQuery();

  return (
    <div className="bg-background min-h-screen pt-24 pb-24">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-xl">
            <Badge className="mb-4 rounded-full px-4 py-1 uppercase tracking-widest text-[10px] font-black bg-primary/10 text-primary border-none">
              Our Catalog
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-4">
              The Collection.
            </h1>
            <p className="text-muted-foreground text-lg">
              Browse our curated selection of premium products, designed for
              those who value quality and style.
            </p>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              className="rounded-full px-6 h-12 flex gap-2 font-bold group"
            >
              <Filter className="w-4 h-4 group-hover:rotate-180 transition-transform" />
              Filter
            </Button>
            <Button
              variant="outline"
              className="rounded-full px-6 h-12 flex gap-2 font-bold group"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Sort By
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block lg:col-span-3 space-y-10">
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-6 border-l-4 border-primary pl-4">
                Categories
              </h3>
              <ul className="space-y-4">
                <li>
                  <button className="text-foreground font-bold hover:text-primary transition-colors flex justify-between w-full group">
                    All Collections{" "}
                    <span className="text-muted-foreground font-medium group-hover:text-primary transition-colors">
                      {productsData?.data?.products?.length || 0}
                    </span>
                  </button>
                </li>
                {categories?.map((cat: any) => (
                  <li key={cat.id}>
                    <button className="text-muted-foreground font-bold hover:text-primary transition-colors flex justify-between w-full group">
                      {cat.categoryName}{" "}
                      <span className="font-medium group-hover:text-primary transition-colors">
                        12
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-6 border-l-4 border-primary pl-4">
                Price Range
              </h3>
              <div className="space-y-4">
                <div className="h-1 bg-secondary rounded-full relative overflow-hidden">
                  <div className="absolute left-[10%] right-[30%] h-full bg-primary" />
                </div>
                <div className="flex justify-between text-sm font-bold">
                  <span>$0</span>
                  <span>$1000+</span>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-4xl bg-secondary/30 border border-border/50 overflow-hidden relative group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all" />
              <h4 className="text-xl font-black mb-4 relative z-10">
                Need Help?
              </h4>
              <p className="text-sm text-muted-foreground mb-6 relative z-10 leading-relaxed">
                Our specialists are here to help you find the perfect match.
              </p>
              <Button
                variant="outline"
                className="w-full rounded-xl font-bold bg-background"
              >
                Contact Us
              </Button>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-9">
            {isProductsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="aspect-4/5 bg-muted animate-pulse rounded-4xl"
                  />
                ))}
              </div>
            ) : (
              <ProductLists products={productsData?.data?.products} />
            )}

            {/* Pagination Placeholder */}
            {!isProductsLoading && productsData?.data?.products?.length > 0 && (
              <div className="mt-20 flex justify-center gap-2">
                {[1, 2, 3].map((i) => (
                  <Button
                    key={i}
                    variant={i === 1 ? "default" : "outline"}
                    className={cn(
                      "h-12 w-12 rounded-xl font-bold",
                      i === 1 && "shadow-lg shadow-primary/20"
                    )}
                  >
                    {i}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  className="h-12 px-6 rounded-xl font-bold"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
