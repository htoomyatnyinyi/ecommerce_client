import { useState } from "react";
import { useGetProductsQuery } from "@/redux/query/productApi";
import { addToCart } from "@/redux/slice/cartSlice";
import { useDispatch } from "react-redux";

interface VariantOption {
  id: string;
  attributeName: string;
  attributeValue: string;
  variantId: string;
}

interface Variant {
  id: string;
  sku: string;
  price: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
  productId: string;
  variantOptions: VariantOption[];
}

interface Image {
  id: string;
  url: string;
  altText: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
  productId: string;
}

interface Product {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updateAt: string;
  userId: string;
  categoryId: string | null;
  brandId: string | null;
  variants: Variant[];
  images: Image[];
  category: string | null;
  brand: string | null;
}

interface Pagination {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

interface ProductResponse {
  success: boolean;
  data: Product[];
  pagination: Pagination;
}

const ProductList: React.FC = () => {
  const dispatch = useDispatch();
  const {
    data: response,
    isLoading: isGetProductsLoading,
    isError: isGetProductsError,
  } = useGetProductsQuery() as {
    data: ProductResponse;
    isLoading: boolean;
    isError: boolean;
  };

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Our Products</h1>
      {isGetProductsError ? (
        <div className="text-red-500 text-center py-4">
          Failed to load products. Please try again later.
        </div>
      ) : isGetProductsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {response?.data?.map((product: Product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
          <PaginationControls pagination={response?.pagination} />
        </>
      )}
    </div>
  );
};

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const primaryImage =
    product.images.find((img) => img.isPrimary) || product.images[0];

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative">
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={primaryImage.altText || product.title}
              className="w-full h-48 object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h2
            className="text-xl font-semibold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => setIsModalOpen(true)}
            aria-label={`View details for ${product.title}`}
          >
            {product.title}
          </h2>
          <p className="text-gray-600 mt-1 line-clamp-2">
            {product.description}
          </p>
          {product.variants[0] && (
            <>
              <p className="text-lg font-bold text-gray-900 mt-2">
                ${parseFloat(product.variants[0].price).toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">
                {product.variants[0].stock > 0
                  ? `In Stock: ${product.variants[0].stock}`
                  : "Out of Stock"}
              </p>
            </>
          )}
          <button
            onClick={() => onAddToCart(product)}
            className={`mt-4 w-full py-2 rounded-md text-white ${
              product.variants[0]?.stock > 0
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            } transition-colors`}
            disabled={product.variants[0]?.stock === 0}
            aria-label={`Add ${product.title} to cart`}
          >
            {product.variants[0]?.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>

      {isModalOpen && (
        <ProductModal
          product={product}
          onClose={() => setIsModalOpen(false)}
          onAddToCart={onAddToCart}
        />
      )}
    </>
  );
};

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800">{product.title}</h2>
        <p className="text-gray-600 mt-2">{product.description}</p>
        <div className="mt-4">
          {product.images.map((image) => (
            <img
              key={image.id}
              src={image.url}
              alt={image.altText}
              className="w-full h-32 object-cover mb-2 rounded-md"
              loading="lazy"
            />
          ))}
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Variants</h3>
          {product.variants.map((variant) => (
            <div key={variant.id} className="border p-2 mt-2 rounded-md">
              <p className="text-sm">SKU: {variant.sku}</p>
              <p className="text-sm">
                Price: ${parseFloat(variant.price).toFixed(2)}
              </p>
              <p className="text-sm">Stock: {variant.stock}</p>
              {variant.variantOptions.map((option) => (
                <p key={option.id} className="text-sm capitalize">
                  {option.attributeName}: {option.attributeValue}
                </p>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
            aria-label="Close modal"
          >
            Close
          </button>
          <button
            onClick={() => onAddToCart(product)}
            className={`py-2 px-4 rounded-md text-white ${
              product.variants[0]?.stock > 0
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            } transition-colors`}
            disabled={product.variants[0]?.stock === 0}
            aria-label={`Add ${product.title} to cart from modal`}
          >
            {product.variants[0]?.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
};

const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-200"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
        <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );
};

interface PaginationControlsProps {
  pagination: Pagination | undefined;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  pagination,
}) => {
  if (!pagination || pagination.totalPages <= 1) return null;

  return (
    <div className="mt-6 flex justify-center space-x-2">
      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
        (page) => (
          <button
            key={page}
            className={`px-4 py-2 rounded-md ${
              page === pagination.currentPage
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } transition-colors`}
            aria-label={`Go to page ${page}`}
          >
            {page}
          </button>
        )
      )}
    </div>
  );
};

export default ProductList;

// import { useGetProductsQuery } from "@/redux/query/productApi";
// import { addToCart } from "@/redux/slice/cartSlice";
// import { useDispatch } from "react-redux";

// const ProductList = () => {
//   const dispatch = useDispatch();
//   const {
//     data: products,
//     isLoading: isGetProductsLoading,
//     isError: isGetProductsError,
//   } = useGetProductsQuery();

//   console.log(products, " chekc");
//   const handleAddToCart = (cartProduct: any) => {
//     dispatch(addToCart(cartProduct));
//   };
//   return (
//     <div>
//       <h1>This is Product Lists</h1>
//       {isGetProductsError ? (
//         <div>Error</div>
//       ) : (
//         <div>
//           {isGetProductsLoading ? (
//             <div>Loading...</div>
//           ) : (
//             <div>
//               <div className="p-2 m-1">
//                 {products &&
//                   products?.data?.map((product: any) => (
//                     <div
//                       key={product.id}
//                       onClick={() => handleAddToCart(product)}
//                       // onClick={() => alert(`Click on id: ${product.id}`)}
//                       className="p-2 m-1 hover:border cursor-auto "
//                     >
//                       <h1>{product.title}</h1>
//                       <p>{product.description}</p>
//                       <p>{product.category}</p>
//                       <p>{product.createdAt}</p>
//                       <div className="p-2 m-1 border">
//                         {product?.images.map((e: any) => (
//                           <div key={e.id}>
//                             <p>{e.url}</p>
//                             <p>{e.createdAt}</p>
//                             <img
//                               src={e.url}
//                               alt={e.altText}
//                               width={100}
//                               height={100}
//                               className="p-2 m-1  bg-amber-200"
//                             />
//                           </div>
//                         ))}
//                       </div>
//                       <div>
//                         {product?.variants.map((variant: any) => (
//                           <div key={variant.id}>
//                             <p>{variant.sku}</p>
//                             <p>{variant.price}</p>
//                             <p>{variant.stock}</p>
//                             <div>
//                               {variant.variantOptions.map((e: any) => (
//                                 <div key={e.id} className="border">
//                                   {e.id}
//                                   <p>{e.attributeName}</p>
//                                   <p>{e.attributeValue}</p>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//               </div>
//               <RenderProduct data={products} />
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// type RenderProductProps = {
//   data: any;
// };

// const RenderProduct: React.FC<RenderProductProps> = ({ data }) => {
//   const dispatch = useDispatch();

//   const handlePreview = (selectedId: any) => {
//     // console.log("handlepreview", selectedId, " check id");
//     dispatch(addToCart(selectedId));
//   };
//   // console.log(data, "check data in render product");

//   return (
//     <div>
//       <h1>This is header</h1>
//       {data &&
//         data?.data?.map((product: any) => (
//           <div
//             key={product.id}
//             className="p-2 m-1"
//             onClick={() => handlePreview(product)}
//           >
//             <h1>{product.title}</h1>
//             <p>{product.description}</p>
//             <p>{product.category}</p>
//           </div>
//         ))}
//     </div>
//   );
// };

// export default ProductList;
