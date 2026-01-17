import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  useAddToCartMutation,
  useGetProductByIdQuery,
  useGetProductsQuery,
} from "@/redux/query/productApi";
import ProductImageGallery from "./ProductImageGallery";
import RelatedProducts from "./RelatedProducts";
import QuantitySelector from "./QuantitySelector";
import { useDispatch } from "react-redux";
import { addItemToCart } from "@/redux/slice/cartSlice";
import {
  ShoppingCart,
  Star,
  Share2,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ProductDetails: React.FC = () => {
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();

  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
  const [quantity, setQuantity] = useState(1);

  const [addToCart, { isLoading: isAddToCartLoading }] = useAddToCartMutation();

  const {
    data: productResponse,
    isLoading: isProductLoading,
    isError,
  } = useGetProductByIdQuery(id, { skip: !id });

  const product = productResponse?.data;
  console.log(product);

  const { data: allProducts, isLoading: areProductsLoading } =
    useGetProductsQuery();

  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
    // Reset quantity when product changes
    setQuantity(1);
    // Scroll to top when product ID changes
    window.scrollTo(0, 0);
  }, [product, id]);

  if (isProductLoading) {
    return (
      <div className="container mx-auto p-8 md:p-12 animate-pulse mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-muted rounded-3xl" />
          <div className="space-y-6">
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-10 w-3/4 bg-muted rounded" />
            <div className="h-6 w-1/2 bg-muted rounded" />
            <div className="h-32 w-full bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto p-20 text-center mt-16">
        <h2 className="text-3xl font-bold mb-4">Oops! Product not found.</h2>
        <p className="text-muted-foreground mb-8">
          The product you're looking for might have been moved or doesn't exist.
        </p>
        <Button asChild className="rounded-full px-8">
          <Link to="/products">Back to Shop</Link>
        </Button>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (selectedVariant) {
      try {
        // Optimistic update
        dispatch(
          addItemToCart({
            productId: product.id,
            variantId: selectedVariant.id,
            title: product.title,
            image: product.images?.[0]?.url || "",
            quantity: quantity,
            variant: {
              id: selectedVariant.id,
              size: selectedVariant.size,
              price: selectedVariant.price,
              discountPrice: selectedVariant.discountPrice,
            },
          })
        );

        await addToCart({
          productId: product.id,
          variantId: selectedVariant.id,
          quantity,
        }).unwrap();

        toast.success(`Added ${product.title} to your bag!`, {
          description: `${quantity}x ${selectedVariant.size}`,
          duration: 3000,
        });
      } catch (err: any) {
        console.error("Add to cart error:", err);
        if (err.status === 401) {
          toast.error("Please sign in to add items to your cart.");
        } else {
          toast.error("Failed to add to cart. Please try again.");
        }
      }
    }
  };

  return (
    <div className="bg-background min-h-screen pt-24 pb-24">
      <div className="container mx-auto px-4 md:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary transition-colors">
            Shop
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate">
            {product.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-24 mb-24">
          {/* Left: Gallery */}
          <div className="space-y-4">
            <ProductImageGallery images={product.images} />
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <Badge
                    variant="secondary"
                    className="mb-2 rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border-none"
                  >
                    {product.category?.categoryName || "Premium"}
                  </Badge>
                  <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                    {product.title}
                  </h1>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center text-yellow-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={cn(
                        "h-4 w-4 fill-current",
                        s === 5 && "text-muted opacity-30"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold">(128 Reviews)</span>
                <span className="text-muted-foreground">|</span>
                <span className="text-sm text-green-600 font-bold">
                  In Stock
                </span>
              </div>
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed mb-8 border-l-4 border-primary/20 pl-6 py-2 italic font-serif">
              "{product.description}"
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-10">
              <span className="text-4xl font-black text-foreground">
                ${selectedVariant ? selectedVariant.price : "---"}
              </span>
              {selectedVariant?.discountPrice && (
                <span className="text-2xl text-muted-foreground line-through decoration-destructive decoration-2">
                  ${selectedVariant.price}
                </span>
              )}
            </div>

            {/* Selected Variant Details */}
            {selectedVariant && (
              <div className="mb-6 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-bold text-muted-foreground">
                    Color:
                  </span>
                  <span className="font-black">{selectedVariant.color}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-bold text-muted-foreground">SKU:</span>
                  <span className="font-mono text-xs bg-secondary/50 px-2 py-1 rounded">
                    {selectedVariant.sku}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-bold text-muted-foreground">
                    Availability:
                  </span>
                  <span
                    className={cn(
                      "font-bold",
                      selectedVariant.stock > 0
                        ? "text-green-600"
                        : "text-red-500"
                    )}
                  >
                    {selectedVariant.stock > 0
                      ? `${selectedVariant.stock} units available`
                      : "Out of Stock"}
                  </span>
                </div>
              </div>
            )}

            {/* Variant UI */}
            <div className="space-y-8 mb-10 p-8 rounded-4xl bg-secondary/30 border border-border/50">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex justify-between">
                  Select Option
                  <span className="text-primary normal-case font-bold tracking-normal underline underline-offset-4 cursor-pointer">
                    Size Guide
                  </span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((v: any) => (
                    <button
                      key={v.id}
                      disabled={v.stock === 0}
                      onClick={() => setSelectedVariant(v)}
                      className={cn(
                        "h-14 px-4 rounded-xl border-2 transition-all font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed flex flex-col items-center justify-center min-w-[5rem]",
                        selectedVariant?.id === v.id
                          ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                          : "border-border hover:border-primary/50 text-foreground"
                      )}
                    >
                      <span>{v.size}</span>
                      {v.color && (
                        <span className="text-[10px] opacity-80 font-normal">
                          {v.color}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full sm:w-auto">
                  <QuantitySelector
                    quantity={quantity}
                    setQuantity={setQuantity}
                  />
                </div>
                <Button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || isAddToCartLoading}
                  className="w-full lg:w-100 md:w-80 h-14 rounded-2xl text-md font-bold group shadow-xl shadow-primary/20"
                >
                  {isAddToCartLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-background border-t-transparent" />
                      Adding...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      Add to Bag
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-border">
              {[
                {
                  icon: Truck,
                  title: "Free Shipping",
                  desc: "On orders over $99",
                },
                {
                  icon: RotateCcw,
                  title: "30 Days Return",
                  desc: "No questions asked",
                },
                { icon: ShieldCheck, title: "Secured", desc: "Safe checkout" },
              ].map((benefit, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="bg-primary/5 p-3 rounded-full text-primary">
                    <benefit.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{benefit.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {benefit.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-border/50 w-full mb-24" />

        {/* Related Products */}
        <section className="mb-24">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter">
              You May Also Like
            </h2>
            <Link
              to="/products"
              className="font-bold text-primary underline underline-offset-8 decoration-2"
            >
              Shop All
            </Link>
          </div>
          <RelatedProducts
            allProducts={allProducts?.data?.products}
            currentProductId={product.id}
            isLoading={areProductsLoading}
          />
        </section>
      </div>
    </div>
  );
};

export default ProductDetails;
