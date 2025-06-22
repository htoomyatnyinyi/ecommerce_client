import { useState } from "react";
import { useGetProductsQuery } from "@/redux/query/productApi";
import { addToCart } from "@/redux/slice/cartSlice";
import { useDispatch } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// --------------- Product Detail Component (for Dialog Content) ---------------

const ProductDetail = ({ product }: { product: any }) => {
  const dispatch = useDispatch();
  // State to track the selected variant
  const [selectedVariant, setSelectedVariant] = useState(null);

  const handleAddToCart = () => {
    if (selectedVariant) {
      // Dispatching an item with product info and selected variant details
      const itemToAdd = {
        ...product, // Includes product id, title, etc.
        variant: selectedVariant, // The specific variant chosen
      };
      dispatch(addToCart(itemToAdd));
      // Optionally, close the dialog or show a confirmation message
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[80vh] overflow-y-auto">
      {/* Image Gallery Column */}
      <div className="flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {product.title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {product.images?.map((image: any) => (
            <img
              key={image.id}
              src={image.url}
              alt={product.title}
              className="w-full h-auto object-cover rounded-lg shadow-md"
            />
          ))}
        </div>
      </div>

      {/* Details & Actions Column */}
      <div className="flex flex-col space-y-4">
        <div>
          <h3 className="font-semibold text-lg mb-2">Description</h3>
          <p className="text-gray-600">{product.description}</p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">Choose Variant</h3>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((variant: any) => (
              <Button
                key={variant.id}
                variant={
                  selectedVariant?.id === variant.id ? "default" : "outline"
                }
                onClick={() => setSelectedVariant(variant)}
              >
                {/* Assuming a simple variant naming, can be improved */}
                {variant.variantOptions
                  .map((opt) => opt.attributeValue)
                  .join(" / ")}
              </Button>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <p className="text-3xl font-bold">
            Price: ${selectedVariant ? selectedVariant.price : "N/A"}
          </p>
          <p className="text-sm text-gray-500">
            Stock:{" "}
            {selectedVariant ? selectedVariant.stock : "Select a variant"}
          </p>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={!selectedVariant || selectedVariant.stock === 0}
          size="lg"
          className="mt-auto"
        >
          {selectedVariant?.stock === 0 ? "Out of Stock" : "Add To Cart"}
        </Button>
      </div>
    </div>
  );
};

// --------------- Product Card Component ---------------

const ProductCard = ({ product }: { product: any }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
          <div className="w-full h-48 overflow-hidden">
            <img
              src={product.images?.[0]?.url || "/placeholder.svg"} // Fallback image
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold truncate">{product.title}</h3>
            <p className="text-gray-500 mt-1 truncate">{product.description}</p>
            {/* Displaying price range of variants */}
            <p className="text-md font-bold mt-2">
              ${Math.min(...product.variants.map((v) => v.price))} - $
              {Math.max(...product.variants.map((v) => v.price))}
            </p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <ProductDetail product={product} />
      </DialogContent>
    </Dialog>
  );
};

// --------------- Main Product Page Component ---------------

const Product = () => {
  const { data: productsResponse, isLoading, isError } = useGetProductsQuery();

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading products...</p>
      </div>
    );
  if (isError)
    return (
      <div className="flex justify-center items-center h-screen">
        <p>An error occurred while fetching products.</p>
      </div>
    );

  console.log(productsResponse?.responseProducts);
  const products = productsResponse?.responseProducts || [];

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Products</h1>
      {products.length > 0 ? (
        // Grid container is OUTSIDE the map function
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p>No products found.</p>
        </div>
      )}
    </div>
  );
};

export default Product;
