import React from "react";
import { useDispatch } from "react-redux";
import { useGetProductsQuery } from "@/redux/query/productApi";
import { addToCart } from "@/redux/slice/cartSlice";
// import ImageCarousel from "@/components/product/ImageCarousel";
import ProductCard from "@/components/product/ProductCard";

const Product: React.FC = () => {
  const { data: products, error, isLoading } = useGetProductsQuery({});
  const dispatch = useDispatch();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: </div>;

  // console.log(
  //   products?.data.map((e: any) => e),
  //   "check at frontedn"
  // );

  return (
    <div className="">
      <h1 className="text-8xl font-serif font-semibold bg-gradient-to-br from-slate-100 to-slate-900 text-transparent text-clip bg-clip-text">
        HTOO MYAT NYI NYI
      </h1>
      <div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-2 h-screen">
            {/* <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 h-screen"> */}
            {products.data.map((product: any) => (
              <div key={product.id}>
                <ProductCard product={product} />
                <div className="text-cyan-500 font-bold text-2xl p-2 m-1">
                  <h1>{product.id}</h1>
                  <p>{product.title}</p>
                  <p>{product.description}</p>
                  <p>{product.categoryId} : CategoryId</p>
                  <p>{product.userId} : userId</p>
                  <p>{product.createdAt} : createdAt</p>
                  {/* <ImageCarousel product_image={product} /> */}
                </div>
                <div className="border p-2 m-1">
                  <h1>Category </h1>
                  <p>{product.category.id}</p>
                  <h1>{product.category.categoryName}</h1>
                </div>
                <div className="border p-2 m-1">
                  {product.variants.map((variant: any) => (
                    <div key={variant.id}>
                      <p>{variant.id} : variant</p>
                      <p>{variant.sku} : sku</p>
                      <p>{variant.price} : price</p>
                      <p>
                        {variant.discountPrice ? (
                          <p>{variant.dicountPrice}</p>
                        ) : null}
                      </p>
                      <p>{variant.stock} : stock</p>
                      <p>{variant.isActive ? "Active" : "Inactive"}</p>
                      <p>{variant.productId} : productId</p>
                      <p>{variant.createdAt} : createdAt</p>
                      <p>{variant.updatedAt} : updatedAt</p>
                      <div>
                        {variant.variantOptions.map((option: any) => (
                          <div key={option.id} className="border p-2 m-1">
                            <p>{option.id} : option</p>
                            <p>{option.attributeName} : attributename</p>
                            <p>{option.attributeValue} : attributeValue</p>
                            <p>{option.attributeStock} : attributeStock</p>
                            <p>{option.variantId} : variantId</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => dispatch(addToCart(product))}
                  className=" text-green-500 border hover:bg-green-500 hover:text-white transition-colors duration-300 p-2 m-1 rounded-md"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;

// import React from "react";
// import { useDispatch } from "react-redux";
// import { useGetProductsQuery } from "@/redux/query/productApi";
// import { addToCart } from "@/redux/slice/cartSlice";
// import ImageCarousel from "@/components/product/ImageCarousel";

// const Product: React.FC = () => {
//   const { data: products, error, isLoading } = useGetProductsQuery({});
//   const dispatch = useDispatch();

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error: </div>;

//   console.log(
//     products?.data.map((e: any) => e),
//     "check at frontedn"
//   );

//   return (
//     <div className="bg-gradient-to-tl from-slate-400 to-slate-900">
//       <h1 className="text-8xl font-serif font-semibold bg-gradient-to-br from-slate-100 to-slate-900 text-transparent text-clip bg-clip-text">
//         HTOO MYAT NYI NYI
//       </h1>
//       <div>{products?.data[0].title}</div>
//       <div>
//         {isLoading ? (
//           <p>Loading...</p>
//         ) : (
//           <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 h-screen">
//             {products.data.map((product: any) => (
//               <div key={product.id}>
//                 <div className="text-cyan-500 font-bold text-2xl p-2 m-1">
//                   <h1>{product.id}</h1>
//                   <p>{product.title}</p>
//                   <p>{product.description}</p>
//                   <p>{product.categoryId} : CategoryId</p>
//                   <p>{product.userId} : userId</p>
//                   <p>{product.createdAt} : createdAt</p>
//                   <ImageCarousel product_image={product} />
//                   {/* <div className="p-2 m-1 backdrop-blur-sm">
//                   {product.images.map((image: any) => (
//                     <div key={image.id} className="h-40 w-40 ">
//                     <img
//                     src={image.url}
//                     alt={image.altText}
//                     width={100}
//                     height={100}
//                     className="m-1 w-full h-full "
//                     />
//                     <div>
//                     {image.id} :image {image.createdAt}
//                     </div>
//                     </div>
//                     ))}
//                     </div> */}
//                 </div>
//                 <div className="border p-2 m-1">
//                   <h1>Category </h1>
//                   <p>{product.category.id}</p>
//                   <h1>{product.category.categoryName}</h1>
//                 </div>
//                 <div className="border p-2 m-1">
//                   {product.variants.map((variant: any) => (
//                     <div key={variant.id}>
//                       <p>{variant.id} : variant</p>
//                       <p>{variant.sku} : sku</p>
//                       <p>{variant.price} : price</p>
//                       <p>
//                         {variant.discountPrice ? (
//                           <p>{variant.dicountPrice}</p>
//                         ) : null}
//                       </p>
//                       <p>{variant.stock} : stock</p>
//                       <p>{variant.isActive ? "Active" : "Inactive"}</p>
//                       <p>{variant.productId} : productId</p>
//                       <p>{variant.createdAt} : createdAt</p>
//                       <p>{variant.updatedAt} : updatedAt</p>
//                       <div>
//                         {/* {variant.images.map((image: any) => (
//                           <div key={image.id}>
//                             <img
//                               src={image.url}
//                               alt={image.altText}
//                               width={100}
//                               height={100}
//                             />
//                           </div>
//                         ))} */}
//                         {variant.variantOptions.map((option: any) => (
//                           <div key={option.id} className="border p-2 m-1">
//                             <p>{option.id} : option</p>
//                             <p>{option.attributeName} : attributename</p>
//                             <p>{option.attributeValue} : attributeValue</p>
//                             <p>{option.attributeStock} : attributeStock</p>
//                             <p>{option.variantId} : variantId</p>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 <button
//                   onClick={() => dispatch(addToCart(product))}
//                   className=" text-green-500 border hover:bg-green-500 hover:text-white transition-colors duration-300 p-2 m-1 rounded-md"
//                 >
//                   Add to Cart
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Product;
