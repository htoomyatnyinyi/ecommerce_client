import React from "react";
import { useDispatch } from "react-redux";
import { useGetProductsQuery } from "@/redux/query/productApi";
import { addToCart } from "@/redux/slice/cartSlice";

const Home: React.FC = () => {
  const { data: products, error, isLoading } = useGetProductsQuery();
  const dispatch = useDispatch();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: </div>;

  console.log(products, "check at frontedn");

  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 h-screen">
        <div className="md:h-screen outline md:col-span-2 ">
          <div className="p-2 m-1 bg-amber-200 w-full h-full"></div>
        </div>
        <div className="md:col-span-1 outline max-h-screen overflow-auto gap-5 p-2 m-1 ">
          {/* {products?.map((product) => ( */}
          {products?.data?.map((product) => (
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
      </div>
    </div>
  );
};

export default Home;

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
