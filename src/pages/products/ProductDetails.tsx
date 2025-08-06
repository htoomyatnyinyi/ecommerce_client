import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useAddToCartMutation,
  useGetProductByIdQuery,
  useGetProductsQuery,
} from "@/redux/query/productApi";
import ProductImageGallery from "./ProductImageGallery";
import RelatedProducts from "./RelatedProducts";
import SearchForm from "@/components/search/SearchForm";
import QuantitySelector from "./QuantitySelector";
import { useDispatch } from "react-redux";
import { addItemToCart } from "@/redux/slice/cartSlice";

const ProductDetails: React.FC = () => {
  const dispatch = useDispatch();

  // Use a specific type for params for better type safety
  const { id } = useParams<{ id: any }>();

  // --- State for selection ---
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
  const [quantity, setQuantity] = useState(1);

  // console.log(selectedVariant);

  const [addToCart, { isLoading: isAddToCartLoading }] = useAddToCartMutation();

  const {
    data: product,
    isLoading: isProductLoading,
    isError,
  } = useGetProductByIdQuery(id, { skip: !id });

  // --- Auto-select the first available variant when product data loads ---
  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  // Fetch all products for the 'Related Products' section
  const { data: allProducts, isLoading: areProductsLoading } =
    useGetProductsQuery();

  // Handle loading and error states for the main product FIRST
  if (isProductLoading) {
    return <p className="text-center mt-20">Loading Product...</p>;
  }

  if (isError || !product) {
    return (
      <p className="text-center mt-20 text-red-500">Could not load product.</p>
    );
  }

  const handleAddToCart = () => {
    if (selectedVariant) {
      dispatch(
        addItemToCart({
          ...product, // Send product info
          variant: selectedVariant, // Send selected variant info
          quantity: quantity,
        })
      );

      addToCart({
        productId: product.id,
        variantId: selectedVariant.id,
        quantity,
      });
      // // Optionally, show a success message here
      // console.log("Added to cart:", {
      //   product: product.title,
      //   variant: selectedVariant,
      //   quantity,
      // });
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <SearchForm />
      {/* Main product details section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16">
        {/* Left side: Image Gallery */}
        <ProductImageGallery images={product.images} />

        {/* Right side: Product Information */}
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {product.title}
          </h1>
          <p className="mb-6">{product.description}</p>
          <div className="mt-4 border-t pt-4">
            <h3 className="text-xl font-semibold mb-2">Available Options</h3>
            {/* <div className="space-y-2">
              {product.variants.map((variant: any) => (
                <div
                  key={variant.id}
                  className="p-3 border rounded-md bg-white/10 flex justify-between items-center"
                >
                  <div>
                    <p>
                      <span className="font-semibold">Size:</span>
                      {variant.size}
                    </p>
                    <p className="text-sm text-gray-400">SKU: {variant.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">${variant.price}</p>
                    <p className="text-sm">
                      {variant.stock > 0
                        ? `${variant.stock} in stock`
                        : "Out of stock"}
                    </p>
                  </div>
                </div>
              ))}
            </div> */}

            {/* --- Variant Selection --- */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Size:</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant: any) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`py-2 px-4 rounded-md border-2 transition-colors duration-200 ${
                      selectedVariant?.id === variant.id
                        ? "bg-blue-600 border-blue-600 text-white" // Selected style
                        : "bg-white/10 border-gray-600 hover:border-gray-400" // Default style
                    }`}
                  >
                    {variant.size}
                  </button>
                ))}
              </div>
            </div>
            {/* --- Price Display (updates when variant changes) --- */}
            <p className="text-3xl font-bold mb-6">
              ${selectedVariant ? selectedVariant.price : "---"}
            </p>

            {/* --- Add to Cart Section --- */}
            <div className="flex items-center gap-4">
              <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant} // Disable button if no variant is selected
                className="flex-grow bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related products section at the bottom */}
      <RelatedProducts
        allProducts={allProducts?.products}
        currentProductId={product.id}
        isLoading={areProductsLoading}
      />
    </div>
  );
};

export default ProductDetails;

// import React from "react";
// import {
//   useGetProductByIdQuery,
//   useGetProductsQuery,
// } from "@/redux/query/productApi";
// import { useParams } from "react-router-dom";

// const ProductDetails: React.FC = () => {
//   const { id } = useParams<any>();
//   // console.log(useParams());

//   const { data: product, isLoading: isProductByIdLoading } =
//     useGetProductByIdQuery(id, {
//       skip: !id,
//     });

//   const { data: products, isLoading: isProductsLoading } =
//     useGetProductsQuery();

//   if (isProductsLoading) return <p>Loading..</p>;

//   console.log(products);

//   return (
//     <div className="h-screen">
//       <div className="container mx-auto gap-8">
//         {isProductByIdLoading ? (
//           <div>Loading ...</div>
//         ) : (
//           <div className="bg-white/5">
//             <div className="flex flex-col md:flex-row justify-center ">
//               <div className="bg-green-500">
//                 {product.images.map((image: any) => (
//                   <div className="h-full w-full">
//                     <img
//                       src={image.url}
//                       alt={image.altText}
//                       className="h-[50%] w-[50%]"
//                     />
//                   </div>
//                 ))}
//               </div>
//               <div className="bg-green-400">
//                 <h3>{product.title}</h3>
//                 <p>{product.description}</p>
//                 <div>
//                   {product.variants.map((variant: any) => (
//                     <div key={variant.id} className="p-2 m-1 border">
//                       <p>sku : {variant.sku}</p>
//                       <p>price : {variant.price}</p>
//                       <p>size : {variant.size}</p>
//                       <p>stock : {variant.stock}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//             <div className="bg-green-400 h-40 m-1 ">
//               <div className="container mx-auto">
//                 <div className="flex gap-8">
//                   {products?.products.map((product: any) => (
//                     <div key={product.id} className="">
//                       <p>{product.title}</p>
//                       <p>{product.description}</p>
//                       <p>
//                         {product.images.map((image: any) => (
//                           <div key={image.id}>
//                             {image.altText}
//                             <img
//                               src={image.url}
//                               alt={image.altText}
//                               className="h-20 2-40"
//                             />
//                           </div>
//                         ))}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//       {/* <div className="h-screen">
//         {products?.products.map((product: any) => (
//           <div key={product.id}>
//             <p>{product.title}</p>
//             <p>{product.description}</p>
//           </div>
//         ))}
//       </div> */}
//     </div>
//   );
// };

// export default ProductDetails;
