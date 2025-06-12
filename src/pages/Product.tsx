import React from "react";
import {
  useGetProductsQuery,
  // useGetProductByIdQuery,
} from "@/redux/query/productApi";
import { addToCart } from "@/redux/slice/cartSlice";
import { useDispatch } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
const Product: React.FC = () => {
  const dispatch = useDispatch();
  const {
    data: products,
    isLoading: isGetProductsLoading,
    error: isGerProductError,
  } = useGetProductsQuery({});

  if (isGerProductError) return <p>There is And Error</p>;
  console.log(products?.data);

  const handleDetails = async (productId: number | null) => {
    console.log("Hi This is Product Id", productId);
  };

  return (
    <div className="h-screen ">
      {isGetProductsLoading ? (
        <div>Loading..</div>
      ) : (
        <div>
          {products?.data?.map((product: any) => (
            <div
              key={product.id}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
            >
              <Dialog>
                <div onClick={() => handleDetails(product.id)}>
                  <div>
                    {product.images.map((image: any) => (
                      <div key={image.id}>
                        <DialogTrigger>
                          <img
                            src={image.url}
                            alt="imageUrl"
                            className="bg-cover w-auto h-auto"
                          />
                          <p>{product.title}</p>
                          <p>{product.description}</p>
                        </DialogTrigger>
                      </div>
                    ))}
                  </div>
                </div>
                <DialogContent>
                  <div className="overflow-auto">
                    <DialogHeader>
                      <DialogTitle>Product Detail</DialogTitle>
                      <DialogDescription>
                        <div className="p-2 m-1">
                          <h1>{product.title}</h1>
                          <h1>{product.description}</h1>
                          <div>
                            {product.images.map((image: any) => (
                              <div key={image.id} className="p-2 m-1">
                                <img src={image.url} alt="imageUrl" />
                              </div>
                            ))}
                          </div>
                          <div>
                            {product.variants.map((variant: any) => (
                              <div key={variant.id} className="p-2 m-1">
                                <p>SKU: {variant.sku}</p>
                                <p>Price: {variant.price}</p>
                                <p>Stock: {variant.stock}</p>
                                <div>
                                  {variant.variantOptions.map(
                                    (variantOption: any) => (
                                      <div key={variantOption.key}>
                                        <span>
                                          {variantOption.attributeName}
                                        </span>
                                        -
                                        <span>
                                          {variantOption.attributeValue}
                                        </span>
                                        : available =
                                        <span>
                                          {variantOption.attributeStock}
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          <Button onClick={() => dispatch(addToCart(product))}>
                            Add To Cart
                          </Button>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Product;

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";

// type DialogPageProps = {
//   productDetails: any; // Replace 'any' with a proper type if available
// };

// const DialogPage: React.FC<DialogPageProps> = ({ productDetails }) => {
//   console.log(productDetails, "at dialog");
//   return (
//     <div>
//       <Dialog>
//         <DialogTrigger>Open</DialogTrigger>
//         <DialogContent>
//           <div className="overflow-auto">
//             <DialogHeader>
//               <DialogTitle>Are you absolutely sure?</DialogTitle>
//               <DialogDescription>
//                 This action cannot be undone. This will permanently delete your
//                 account and remove your data from our servers.
//               </DialogDescription>
//             </DialogHeader>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

//#dialog
// import React from "react";
// import { useGetProductsQuery } from "@/redux/query/productApi";
// import ProductCard from "@/components/product/ProductCard";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";

// const Product: React.FC = () => {
//   const { data: products, error, isLoading } = useGetProductsQuery({});

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error: </div>;

//   return (
//     <div className="">
//       <h1 className="text-8xl font-serif font-semibold bg-gradient-to-br from-slate-100 to-slate-900 text-transparent text-clip bg-clip-text">
//         HTOO MYAT NYI NYI
//       </h1>
//       <div>
//         <Button
//           variant="outline"
//           onClick={() =>
//             toast("Event has been created", {
//               description: "Sunday, December 03, 2023 at 9:00 AM",
//               action: {
//                 label: "Undo",
//                 onClick: () => console.log("Undo"),
//               },
//             })
//           }
//         >
//           Show Toast
//         </Button>
//         <div>
//           <Accordion type="single" collapsible>
//             <AccordionItem value="item-1">
//               <AccordionTrigger>Is it accessible?</AccordionTrigger>
//               <AccordionContent>
//                 Yes. It adheres to the WAI-ARIA design pattern.
//               </AccordionContent>
//             </AccordionItem>
//           </Accordion>
//         </div>
//       </div>
//       <div>
//         {isLoading ? (
//           <p>Loading...</p>
//         ) : (
//           <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 h-screen">
//             {/* <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 h-screen"> */}
//             {products.data.map((product: any) => (
//               <div key={product.id}>
//                 <ProductCard product={product} />
//                 <div className="border p-2 m-1">
//                   {product.variants.map((variant: any) => (
//                     <div key={variant.id}>
//                       <Accordion type="single" collapsible>
//                         <AccordionItem value={variant.id}>
//                           <AccordionTrigger>
//                             <div>
//                               <p>{variant.sku}</p>
//                               <p>{variant.price}</p>
//                             </div>
//                           </AccordionTrigger>
//                           <AccordionContent>
//                             <div>
//                               {variant.variantOptions.map((option: any) => (
//                                 <div key={option.id} className="border p-2 m-1">
//                                   <Accordion type="single" collapsible>
//                                     <AccordionItem value={option.id}>
//                                       <AccordionTrigger>
//                                         {option.attributeName}
//                                       </AccordionTrigger>
//                                       <AccordionContent>
//                                         <p>{option.attributeValue}</p>
//                                         <p>{option.attributeStock}</p>
//                                       </AccordionContent>
//                                     </AccordionItem>
//                                   </Accordion>
//                                 </div>
//                               ))}
//                             </div>
//                           </AccordionContent>
//                         </AccordionItem>
//                       </Accordion>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Product;

// // import React from "react";
// // import { useDispatch } from "react-redux";
// // import { useGetProductsQuery } from "@/redux/query/productApi";
// // import { addToCart } from "@/redux/slice/cartSlice";
// // // import ImageCarousel from "@/components/product/ImageCarousel";
// // import ProductCard from "@/components/product/ProductCard";

// // import { toast } from "sonner";
// // import { Button } from "@/components/ui/button";
// // import {
// //   Accordion,
// //   AccordionContent,
// //   AccordionItem,
// //   AccordionTrigger,
// // } from "@/components/ui/accordion";

// // const Product: React.FC = () => {
// //   const { data: products, error, isLoading } = useGetProductsQuery({});
// //   const dispatch = useDispatch();

// //   if (isLoading) return <div>Loading...</div>;
// //   if (error) return <div>Error: </div>;

// //   // console.log(
// //   //   products?.data.map((e: any) => e),
// //   //   "check at frontedn"
// //   // );

// //   return (
// //     <div className="">
// //       <h1 className="text-8xl font-serif font-semibold bg-gradient-to-br from-slate-100 to-slate-900 text-transparent text-clip bg-clip-text">
// //         HTOO MYAT NYI NYI
// //       </h1>
// //       <div>
// //         <Button
// //           variant="outline"
// //           onClick={() =>
// //             toast("Event has been created", {
// //               description: "Sunday, December 03, 2023 at 9:00 AM",
// //               action: {
// //                 label: "Undo",
// //                 onClick: () => console.log("Undo"),
// //               },
// //             })
// //           }
// //         >
// //           Show Toast
// //         </Button>
// //         <div>
// //           <Accordion type="single" collapsible>
// //             <AccordionItem value="item-1">
// //               <AccordionTrigger>Is it accessible?</AccordionTrigger>
// //               <AccordionContent>
// //                 Yes. It adheres to the WAI-ARIA design pattern.
// //               </AccordionContent>
// //             </AccordionItem>
// //           </Accordion>
// //         </div>
// //       </div>
// //       <div>
// //         {isLoading ? (
// //           <p>Loading...</p>
// //         ) : (
// //           <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-2 h-screen">
// //             {/* <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 h-screen"> */}
// //             {products.data.map((product: any) => (
// //               <div key={product.id}>
// //                 <ProductCard product={product} />
// //                 {/* <div className="text-cyan-500 font-bold text-lg p-2 m-1">
// //                   <h1>{product.id}</h1>
// //                   <p>{product.title}</p>
// //                   <p>{product.description}</p>
// //                   <p>{product.categoryId} : CategoryId</p>
// //                   <p>{product.userId} : userId</p>
// //                   <p>{product.createdAt} : createdAt</p>
// // // remove                  <ImageCarousel product_image={product} />
// //                 </div> */}
// //                 <div className="border p-2 m-1">
// //                   <h1>Category </h1>
// //                   {/* <p>{product.category.id}</p> */}
// //                   <h1>{product.category.categoryName}</h1>
// //                 </div>
// //                 <div className="border p-2 m-1">
// //                   {product.variants.map((variant: any) => (
// //                     <div key={variant.id}>
// //                       <Accordion type="single" collapsible>
// //                         <AccordionItem value={variant.id}>
// //                           <AccordionTrigger>
// //                             <div>
// //                               <p>{variant.sku}</p>
// //                               <p>{variant.price}</p>
// //                             </div>
// //                           </AccordionTrigger>
// //                           <AccordionContent>
// //                             <div>
// //                               Yes. It adheres to the WAI-ARIA design pattern.
// //                               {variant.variantOptions.map((option: any) => (
// //                                 <div key={option.id} className="border p-2 m-1">
// //                                   {/* <Accordion type="single" collapsible>
// //                               <AccordionItem value={option.id}>
// //                                 <AccordionTrigger>
// //                                   {option.attributeName}
// //                                 </AccordionTrigger>
// //                                 <AccordionContent>
// //                                   Yes. It adheres to the WAI-ARIA design
// //                                   pattern.
// //                                   <p>{option.attributeValue}</p>
// //                                   <p>{option.attributeStock}</p>
// //                                 </AccordionContent>
// //                               </AccordionItem>
// //                             </Accordion> */}
// //                                   <p>{option.id} : option</p>
// //                                   <p>{option.attributeName} : attributename</p>
// //                                   <p>
// //                                     {option.attributeValue} : attributeValue
// //                                   </p>
// //                                   <p>
// //                                     {option.attributeStock} : attributeStock
// //                                   </p>
// //                                   <p>{option.variantId} : variantId</p>
// //                                 </div>
// //                               ))}
// //                             </div>
// //                           </AccordionContent>
// //                         </AccordionItem>
// //                       </Accordion>

// //                       <p>{variant.id} : variant</p>
// //                       <p>{variant.sku} : sku</p>
// //                       <p>{variant.price} : price</p>
// //                       <p>
// //                         {variant.discountPrice ? (
// //                           <p>{variant.dicountPrice}</p>
// //                         ) : null}
// //                       </p>
// //                       <p>{variant.stock} : stock</p>
// //                       <p>{variant.isActive ? "Active" : "Inactive"}</p>
// //                       <p>{variant.productId} : productId</p>
// //                       <p>{variant.createdAt} : createdAt</p>
// //                       <p>{variant.updatedAt} : updatedAt</p>
// //                       <div>
// //                         {variant.variantOptions.map((option: any) => (
// //                           <div key={option.id} className="border p-2 m-1">
// //                             {/* <Accordion type="single" collapsible>
// //                               <AccordionItem value={option.id}>
// //                                 <AccordionTrigger>
// //                                   {option.attributeName}
// //                                 </AccordionTrigger>
// //                                 <AccordionContent>
// //                                   Yes. It adheres to the WAI-ARIA design
// //                                   pattern.
// //                                   <p>{option.attributeValue}</p>
// //                                   <p>{option.attributeStock}</p>
// //                                 </AccordionContent>
// //                               </AccordionItem>
// //                             </Accordion> */}
// //                             <p>{option.id} : option</p>
// //                             <p>{option.attributeName} : attributename</p>
// //                             <p>{option.attributeValue} : attributeValue</p>
// //                             <p>{option.attributeStock} : attributeStock</p>
// //                             <p>{option.variantId} : variantId</p>
// //                           </div>
// //                         ))}
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //                 <button
// //                   onClick={() => dispatch(addToCart(product))}
// //                   className=" text-green-500 border hover:bg-green-500 hover:text-white transition-colors duration-300 p-2 m-1 rounded-md"
// //                 >
// //                   Add to Cart
// //                 </button>
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default Product;

// // // import React from "react";
// // // import { useDispatch } from "react-redux";
// // // import { useGetProductsQuery } from "@/redux/query/productApi";
// // // import { addToCart } from "@/redux/slice/cartSlice";
// // // import ImageCarousel from "@/components/product/ImageCarousel";

// // // const Product: React.FC = () => {
// // //   const { data: products, error, isLoading } = useGetProductsQuery({});
// // //   const dispatch = useDispatch();

// // //   if (isLoading) return <div>Loading...</div>;
// // //   if (error) return <div>Error: </div>;

// // //   console.log(
// // //     products?.data.map((e: any) => e),
// // //     "check at frontedn"
// // //   );

// // //   return (
// // //     <div className="bg-gradient-to-tl from-slate-400 to-slate-900">
// // //       <h1 className="text-8xl font-serif font-semibold bg-gradient-to-br from-slate-100 to-slate-900 text-transparent text-clip bg-clip-text">
// // //         HTOO MYAT NYI NYI
// // //       </h1>
// // //       <div>{products?.data[0].title}</div>
// // //       <div>
// // //         {isLoading ? (
// // //           <p>Loading...</p>
// // //         ) : (
// // //           <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 h-screen">
// // //             {products.data.map((product: any) => (
// // //               <div key={product.id}>
// // //                 <div className="text-cyan-500 font-bold text-2xl p-2 m-1">
// // //                   <h1>{product.id}</h1>
// // //                   <p>{product.title}</p>
// // //                   <p>{product.description}</p>
// // //                   <p>{product.categoryId} : CategoryId</p>
// // //                   <p>{product.userId} : userId</p>
// // //                   <p>{product.createdAt} : createdAt</p>
// // //                   <ImageCarousel product_image={product} />
// // //                   {/* <div className="p-2 m-1 backdrop-blur-sm">
// // //                   {product.images.map((image: any) => (
// // //                     <div key={image.id} className="h-40 w-40 ">
// // //                     <img
// // //                     src={image.url}
// // //                     alt={image.altText}
// // //                     width={100}
// // //                     height={100}
// // //                     className="m-1 w-full h-full "
// // //                     />
// // //                     <div>
// // //                     {image.id} :image {image.createdAt}
// // //                     </div>
// // //                     </div>
// // //                     ))}
// // //                     </div> */}
// // //                 </div>
// // //                 <div className="border p-2 m-1">
// // //                   <h1>Category </h1>
// // //                   <p>{product.category.id}</p>
// // //                   <h1>{product.category.categoryName}</h1>
// // //                 </div>
// // //                 <div className="border p-2 m-1">
// // //                   {product.variants.map((variant: any) => (
// // //                     <div key={variant.id}>
// // //                       <p>{variant.id} : variant</p>
// // //                       <p>{variant.sku} : sku</p>
// // //                       <p>{variant.price} : price</p>
// // //                       <p>
// // //                         {variant.discountPrice ? (
// // //                           <p>{variant.dicountPrice}</p>
// // //                         ) : null}
// // //                       </p>
// // //                       <p>{variant.stock} : stock</p>
// // //                       <p>{variant.isActive ? "Active" : "Inactive"}</p>
// // //                       <p>{variant.productId} : productId</p>
// // //                       <p>{variant.createdAt} : createdAt</p>
// // //                       <p>{variant.updatedAt} : updatedAt</p>
// // //                       <div>
// // //                         {/* {variant.images.map((image: any) => (
// // //                           <div key={image.id}>
// // //                             <img
// // //                               src={image.url}
// // //                               alt={image.altText}
// // //                               width={100}
// // //                               height={100}
// // //                             />
// // //                           </div>
// // //                         ))} */}
// // //                         {variant.variantOptions.map((option: any) => (
// // //                           <div key={option.id} className="border p-2 m-1">
// // //                             <p>{option.id} : option</p>
// // //                             <p>{option.attributeName} : attributename</p>
// // //                             <p>{option.attributeValue} : attributeValue</p>
// // //                             <p>{option.attributeStock} : attributeStock</p>
// // //                             <p>{option.variantId} : variantId</p>
// // //                           </div>
// // //                         ))}
// // //                       </div>
// // //                     </div>
// // //                   ))}
// // //                 </div>
// // //                 <button
// // //                   onClick={() => dispatch(addToCart(product))}
// // //                   className=" text-green-500 border hover:bg-green-500 hover:text-white transition-colors duration-300 p-2 m-1 rounded-md"
// // //                 >
// // //                   Add to Cart
// // //                 </button>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Product;
