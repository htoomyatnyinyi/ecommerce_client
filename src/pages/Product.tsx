import React from "react";
import { useDispatch } from "react-redux";
import { useGetProductsQuery } from "@/redux/query/productApi";
import { addToCart } from "@/redux/slice/cartSlice";

const Product: React.FC = () => {
  const { data: products, error, isLoading } = useGetProductsQuery({});
  const dispatch = useDispatch();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: </div>;

  console.log(
    products?.data.map((e: any) => e),
    "check at frontedn"
  );

  return (
    <div className="bg-gradient-to-tl from-slate-400 to-slate-900">
      <h1 className="text-8xl font-serif font-semibold bg-gradient-to-br from-slate-100 to-slate-900 text-transparent text-clip bg-clip-text">
        HTOO MYAT NYI NYI
      </h1>
      <div>{products?.data[0].title}</div>
      <div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {products.data.map((product: any) => (
              <div key={product.id}>
                <h1>{product.id}</h1>
                <p>{product.title}</p>
                <p>{product.description}</p>
                <p>{product.categoryId} : CategoryId</p>
                {/* <img src={} alt="" srcset="" /> */}
                <div className="p-2 m-1 backdrop-blur-sm">
                  {product.images.map((image: any) => (
                    <div key={image.id}>
                      <div>
                        {image.id} :image {image.createdAt}
                      </div>
                      <img
                        src={image.url}
                        alt={image.altText}
                        className="h-100 w-100 p-2 m-1"
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => dispatch(addToCart(product))}
                  className=" text-green-500"
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

{
  /* <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 h-screen">
        <div className="md:h-screen outline md:col-span-2 ">
          <div className="p-2 m-1 bg-amber-200 w-full h-full">{products}</div>
        </div>
        <div className="md:col-span-1 outline max-h-screen overflow-auto gap-5 p-2 m-1 ">
          {products?.map((product: any) => (
            <div key={product.id} className="grid grid-rows-4  h-96 border">
              <h1>{product.title} title</h1>
              <p>{product.description} description</p>
              <p>{product.price} price</p>
              <p>{product.category} category</p>
              <p>{product.inStock} instock</p>
              <button
                onClick={() => dispatch(addToCart(product))}
                className=" text-green-500"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div> */
}

// import React from "react";
// import { useDispatch } from "react-redux";
// import { useGetProductsQuery } from "@/redux/query/productApi";
// import { addToCart } from "@/redux/slice/cartSlice";

// const ProductList: React.FC = () => {
//   const { data: products, error, isLoading } = useGetProductsQuery();
//   const dispatch = useDispatch();

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error: </div>;

//   console.log(products, "check at frontedn");

//   return (
//     <div>
//       <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 h-screen">
//         <div className="md:h-screen outline md:col-span-2 ">
//           <div className="p-2 m-1"></div>
//         </div>
//         <div className="md:col-span-1 outline max-h-screen overflow-auto gap-5 p-2 m-1 ">
//           {products?.map((product) => (
//             <div key={product.id} className="grid grid-rows-4  h-96 border">
//               <h1>{product.title} title</h1>
//               <p>{product.description} description</p>
//               <p>{product.price} price</p>
//               <p>{product.category} category</p>
//               <p>{product.inStock} instock</p>
//               <button
//                 onClick={() => dispatch(addToCart(product))}
//                 className=" text-green-500"
//               >
//                 Add to Cart
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductList;

// // <div>
// //   <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 h-screen">
// //     <div className="md:h-screen outline md:col-span-2 p-2 m-1"></div>
// //     <div className="md:col-span-1 outline max-h-screen overflow-auto gap-5 p-2 m-1 ">
// //       {[1, 2, 3, 4, 5, 6].map((e) => (
// //         <div className="grid grid-rows-4 gap-2 h-96 p-2 m-1 border">
// //           hi
// //           <p>{e}</p>
// //         </div>
// //       ))}
// //     </div>
// //   </div>
// // </div>
