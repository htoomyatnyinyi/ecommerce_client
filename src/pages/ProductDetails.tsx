import { useDispatch } from "react-redux";
import { useAddToCartMutation } from "@/redux/query/productApi";
import { addItemToCart } from "@/redux/slice/cartSlice";
import { useState } from "react"; // To manage quantity selection

const ProductDetails = ({
  product,
  onBack,
}: {
  product: any;
  onBack: () => void;
}) => {
  const dispatch = useDispatch();

  const [addToCart, { isLoading }] = useAddToCartMutation();
  const [quantity, setQuantity] = useState(1);
  // from list
  console.log(product, "check to get product id");

  // Assuming you want to add the first variant for simplicity
  // A real implementation would let the user select color/size
  const selectedVariant = product.variants[0];

  const handleAddToCart = async () => {
    if (!selectedVariant) return;

    // 1. Optimistic UI Update: Instantly add to the client-side cart
    dispatch(
      addItemToCart({
        id: selectedVariant.id,
        title: product.title,
        price: selectedVariant.price,
        quantity: quantity,
        image: product.images?.find((img: any) => img.isPrimary)?.url,
      })
    );

    // 2. Send request to the server
    try {
      await addToCart({
        productId: product.id,
        variantId: selectedVariant.id,
        quantity: quantity,
      }).unwrap();
      // Optionally show a success toast/notification
      alert("Added to cart!");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      // Optionally show an error toast/notification
      alert("Failed to add item. Please try again.");
      // Here you could dispatch a "revert" action if needed
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-lg">
      <button onClick={onBack} className="mb-4 ...">
        &larr; Back to List
      </button>
      {/* start */}
      <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
      <p className="text-lg text-gray-700 mb-4">{product.description}</p>

      <div className="flex flex-wrap gap-4 mb-4">
        {product.images.map((image: any) => (
          <img
            key={image.id}
            src={image.url}
            alt={image.altText}
            className="h-40 w-40 object-cover rounded-md border"
          />
        ))}
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-semibold">Variants</h3>
        {product.variants.map((variant: any) => (
          <div key={variant.id} className="border p-3 my-2 rounded">
            <p>
              <strong>Price:</strong> ${variant.price}
            </p>
            <p>
              <strong>SKU:</strong> {variant.sku}
            </p>
            <p>
              <strong>Stock:</strong> {variant.stock}
            </p>
            <div className="mt-2">
              {variant.variantOptions.map((opt: any) => (
                <span
                  key={opt.id}
                  className="mr-2 bg-gray-200 px-2 py-1 rounded"
                >
                  {opt.attributeName}: {opt.attributeValue}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ... other product details ... */}

      <div className="mt-6">
        <h3 className="text-xl font-semibold">Purchase</h3>
        <div className="flex items-center gap-4 mt-2">
          {/* Quantity Selector (optional) */}
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
            className="w-16 p-2 border rounded"
            min="1"
          />
          <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {isLoading ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
