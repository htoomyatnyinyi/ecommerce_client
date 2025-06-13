import {
  useGetProductsQuery,
  useGetProductByIdQuery,
} from "@/redux/query/productApi";
import React, { useState } from "react";

const Product: React.FC = () => {
  const { data: getProducts, isLoading: isGetProductLoading } =
    useGetProductsQuery();

  // const { data: getProductById, isLoading: isGetProductByIdLoading } =
  //   useGetAccountByIdQuery("fjfkalfklwfwlfwlflwjlk");

  // if (isGetProductLoading) return <p>Loading</p>;
  console.log(getProducts);

  // if (isGetProductByIdLoading) return <p>Loading</p>;

  return (
    <div>
      <div>hi</div>
      <div>
        {isGetProductLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="p-2 m-1 border">
            <div>
              {getProducts?.responseProducts.map((product: any) => (
                <div key={product.id} className="p-2 m-1 border">
                  <ProductCard productDetails={product} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;

const ProductCard = ({ productDetails }: { productDetails: any }) => {
  console.log(productDetails, "details");
  return (
    <div>
      <h1>Hello</h1>
    </div>
  );
};

// import React from "react";
// import {
//   useGetProductsQuery,
//   // useGetProductByIdQuery,
// } from "@/redux/query/productApi";
// // import { addToCart } from "@/redux/slice/cartSlice";
// import { useDispatch } from "react-redux";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// // import { Button } from "@/components/ui/button";

// const Product: React.FC = () => {
//   const dispatch = useDispatch();
//   const {
//     data: products,
//     isLoading: isGetProductsLoading,
//     error: isGerProductError,
//   } = useGetProductsQuery({});

//   if (isGerProductError) return <p>There is And Error</p>;
//   console.log(products?.data);

//   const handleDetails = async (productAddToCart: any) => {
//     console.log("Hi This is Product For Add To Cart Info", productAddToCart);
//   };

//   return (
//     <div className="h-screen ">
//       {isGetProductsLoading ? (
//         <div>Loading..</div>
//       ) : (
//         <div>
//           {products?.data?.map((product: any) => (
//             <div
//               key={product.id}
//               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
//             >
//               <Dialog>
//                 <div onClick={() => handleDetails(product.id)}>
//                   <div>
//                     {product.images.map((image: any) => (
//                       <div key={image.id}>
//                         <DialogTrigger>
//                           <img
//                             src={image.url}
//                             alt="imageUrl"
//                             className="bg-cover w-auto h-auto"
//                           />
//                           <p>{product.title}</p>
//                           <p>{product.description}</p>
//                         </DialogTrigger>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//                 <DialogContent>
//                   <div className="overflow-auto">
//                     <DialogHeader>
//                       <DialogTitle>Product Detail</DialogTitle>
//                       <DialogDescription>
//                         {/* <div className="p-2 m-1">
//                           <h1>{product.title}</h1>
//                           <h1>{product.description}</h1>
//                           <div>
//                             {product.images.map((image: any) => (
//                               <div key={image.id} className="p-2 m-1">
//                                 <img src={image.url} alt="imageUrl" />
//                               </div>
//                             ))}
//                           </div>
//                           <div>
//                             {product.variants.map((variant: any) => (
//                               <div key={variant.id} className="p-2 m-1">
//                                 <p>SKU: {variant.sku}</p>
//                                 <p>Price: {variant.price}</p>
//                                 <p>Stock: {variant.stock}</p>
//                                 <div>
//                                   {variant.variantOptions.map(
//                                     (variantOption: any) => (
//                                       <div key={variantOption.key}>
//                                         <span>
//                                           {variantOption.attributeName}
//                                         </span>
//                                         -
//                                         <span>
//                                           {variantOption.attributeValue}
//                                         </span>
//                                         : available =
//                                         <span>
//                                           {variantOption.attributeStock}
//                                         </span>
//                                       </div>
//                                     )
//                                   )}
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                           <Button onClick={() => dispatch(addToCart(product))}>
//                             Add To Cart
//                           </Button>
//                         </div> */}
//                       </DialogDescription>
//                     </DialogHeader>
//                   </div>
//                 </DialogContent>
//               </Dialog>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Product;
