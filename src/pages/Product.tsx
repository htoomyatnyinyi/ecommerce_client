import { useGetProductsQuery } from "@/redux/query/productApi";
import React, { useState } from "react"; // 1. Import useState

// Main Component (Parent)
const Product: React.FC = () => {
  // --- State Management ---
  // State to hold the product object that the user selects
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null); // 2. State for selected product

  // --- RTK Query ---
  const {
    data: products,
    isLoading: isGetProductLoading,
    isError: isGetProductError,
  } = useGetProductsQuery();

  // --- Handlers ---
  // Sets the selected product when a card is clicked
  const handleSelectProduct = (product: any) => {
    setSelectedProduct(product);
  };

  // Clears the selection to go back to the list view
  const handleBackToList = () => {
    setSelectedProduct(null);
  };

  // --- Render Logic ---
  if (isGetProductError) return <p>Error loading products.</p>;
  if (isGetProductLoading)
    return <div className="text-xl text-center">Loading Products...</div>;

  return (
    <div className="p-2 m-1">
      {/* 3. Conditional Rendering: Show details or list based on state */}
      {selectedProduct ? (
        <ProductDetails product={selectedProduct} onBack={handleBackToList} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products?.responseProducts.map((product: any) => (
            <ProductCard
              key={product.id}
              product={product}
              onProductSelect={handleSelectProduct} // Pass handler to child
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Product Card Component (Child)
const ProductCard = ({
  product,
  onProductSelect,
}: {
  product: any;
  onProductSelect: (product: any) => void;
}) => {
  return (
    // 4. Correctly call the handler with the product object on click
    <div
      onClick={() => onProductSelect(product)}
      className="border rounded-lg p-4 shadow-md hover:shadow-xl cursor-pointer transition-shadow"
    >
      {/* Display the primary image if it exists */}
      {product.images?.find((img: any) => img.isPrimary) && (
        <img
          src={product.images.find((img: any) => img.isPrimary).url}
          alt={product.images.find((img: any) => img.isPrimary).altText}
          className="w-full h-48 object-cover rounded-t-lg mb-4"
        />
      )}
      <h3 className="text-lg font-bold">{product.title}</h3>
      <p className="text-gray-600 truncate">{product.description}</p>
      {product.category?.categoryName && (
        <span className="mt-2 inline-block bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm">
          {product.category.categoryName}
        </span>
      )}
    </div>
  );
};

// Product Details Component (Child)
const ProductDetails = ({
  product,
  onBack,
}: {
  product: any;
  onBack: () => void;
}) => {
  return (
    <div className="p-4 border rounded-lg shadow-lg">
      {/* 5. "Back" button to return to the list */}
      <button
        onClick={onBack}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        &larr; Back to List
      </button>

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
    </div>
  );
};

export default Product;
// import { useGetProductsQuery } from "@/redux/query/productApi";
// import React from "react";

// const Product: React.FC = () => {
//   const {
//     data: products,
//     isLoading: isGetProductLoading,
//     isError: isGetProductError,
//   } = useGetProductsQuery();

//   if (isGetProductError) return <p>Error</p>;

//   // console.log(products?.responseProducts);

//   return (
//     <>
//       {isGetProductLoading ? (
//         <div className="text-xl text-center">Loading Get Product ....</div>
//       ) : (
//         <div className="p-2 m-1">
//           {products?.responseProducts.map((product: any) => (
//             <div
//               key={product.id}
//               // onClick={() => handlePreviewDetails(product.id)}
//               // className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border"
//             >
//               <ProductCard product={product} handlePreviewDetails />
//             </div>
//           ))}
//         </div>
//       )}
//     </>
//   );
// };

// const ProductCard = ({ product }: any) => {
//   console.log(product, "card");

//   const handlePreviewDetails = async () => {
//     alert("hi");
//   };
//   return (
//     <>
//       <div>
//         <div onClick={handlePreviewDetails}>
//           <p>{product.title}</p>
//           <p>{product.description}</p>
//           <div>
//             {product.variants.map((variant: any) => (
//               <div key={variant.id}>
//                 <p>{variant.title}</p>
//                 <p>{variant.price}</p>
//                 <p>{variant.sku}</p>
//                 <p>{variant.stock}</p>
//                 <p>
//                   {variant.discountPrice && <div>{variant.discountPrice}</div>}
//                 </p>
//                 <div className="border p-2">
//                   {variant.variantOptions.map((variantOption: any) => (
//                     <div key={variantOption.id}>
//                       <span className=" p-2">
//                         {variantOption.attributeName} -
//                         {variantOption.attributeValue}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div>
//             {product.category.categoryName && (
//               <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full mr-2">
//                 {product.category.categoryName}
//               </span>
//             )}
//           </div>
//         </div>
//         <div>
//           {product.images.map((image: any) => (
//             <img
//               key={image.id}
//               src={image.url}
//               alt={image.altText}
//               className="h-96 w-96"
//             />
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };

// const ProductDetails = ({ product }: any) => {
//   console.log(product, "details");
//   return (
//     <>
//       <h1>Hello World</h1>
//     </>
//   );
// };

// export default Product;
