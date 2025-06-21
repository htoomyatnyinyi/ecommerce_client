import {
  useGetProductsQuery,
  useGetProductByIdQuery,
} from "@/redux/query/productApi";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "@reduxjs/toolkit/query";
import type { RootState } from "@/redux/store/store";
import SearchForm from "@/components/search/SearchForm";

const Product: React.FC = () => {
  const dispatch = useDispatch();

  const query = useSelector((state: RootState) => state.search.query);

  const { data: getProducts, isLoading: isGetProductLoading } =
    useGetProductsQuery();

  // const { data: getProductById, isLoading: isGetProductByIdLoading } =
  //   useGetAccountByIdQuery("fjfkalfklwfwlfwlflwjlk");

  // if (isGetProductLoading) return <p>Loading</p>;
  // console.log(getProducts);

  // if (isGetProductByIdLoading) return <p>Loading</p>;

  console.log(query, " searh");

  // const handleAddToCart = async (product) => {
  //   // Update local Redux store
  //   dispatch(
  //     addToCart({ id: product.id, name: product.name, price: product.price })
  //   );

  //   // Optionally sync with server
  //   try {
  //     await addToCartApi({
  //       id: product.id,
  //       name: product.name,
  //       price: product.price,
  //     }).unwrap();
  //     console.log("Added to cart on server");
  //   } catch (err) {
  //     console.error("Failed to add to cart on server:", err);
  //   }
  // };

  return (
    <div>
      <SearchForm />
      <div>
        {isGetProductLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="p-2 m-1 border">
            <div>
              {getProducts?.responseProducts?.map((product: any) => (
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
    <div key={productDetails.id}>
      <h1>{productDetails.title}</h1>
      <h1>{productDetails.description}</h1>
      <p>{productDetails.categoryId} category</p>
      <div>
        {productDetails.images.map((image: any) => (
          <div key={image.id}>
            {image.url}
            <img src={image.url} alt={image.altText} />
          </div>
        ))}
      </div>
      <div>
        {productDetails.variants.map((variant: any) => (
          <div key={variant.id}>
            <p>{variant.price}</p>
            <p>{variant.sku}</p>
            <p>{variant.stock}</p>
          </div>
        ))}
      </div>
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
