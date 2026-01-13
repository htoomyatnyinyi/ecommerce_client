import React, { useState } from "react";
import Gsap from "./Gsap";

const Sample: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [cars, setCars] = useState<any>([]);

  // add data
  const [year, setYear] = useState(new Date().getFullYear());
  const [model, setModel] = useState("");
  const [manufacture, setManufacture] = useState("");
  // console.log(cars, year, model, manufacture);
  console.log(cars);

  const handleAdd = () => {
    const newCar = {
      // a: year,
      b: model,
      c: manufacture,
    };

    setCars((data: any) => [...data, newCar]);

    setModel("");
    setManufacture("");
  };

  const handleRemove = (id: number) => {
    setCars((data: any) =>
      data.filter((_: null, arrIndex: any) => arrIndex !== id)
    );
  };

  return (
    <div className="h-screen">
      <div className="container mx-auto">
        <div className="" onMouseOver={() => console.log("over")}>
          <p>
            {formData.email} & {formData.password}
          </p>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="p-2 m-1 border"
            placeholder="email"
          />
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="p-2 m-1 border"
            placeholder="email"
          />
        </div>
        <div className="flex-col">
          <div className="p-2 m-1 ">
            {cars.map((car: any, index: number) => (
              <div
                key={index}
                onClick={() => handleRemove(index)}
                className="border m-1 p-2"
              >
                <p>{car.b}</p>
                <p>{car.c}</p>
              </div>
            ))}
          </div>
          <input
            type="date"
            // onChange={(d) => setYear(d.target.value)}
            className="p-2 border"
          />
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="p-2 border"
          />
          <input
            type="text"
            value={manufacture}
            onChange={(e) => setManufacture(e.target.value)}
            className="p-2 border"
          />
          <button onClick={handleAdd} className="p-2 m-1 bg-green-500">
            Add to Array
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sample;

// import React, { useState } from "react";
// import {
//   useGetProductsQuery,
//   useGetProductByIdQuery,
// } from "@/redux/query/productApi";

// const Product: React.FC = () => {
//   const [selected, setSelected] = useState<any | null>(null);
//   const [isOpen, setIsOpen] = useState<boolean>(false);

//   const { data: products } = useGetProductsQuery();
//   const { data: productById } = useGetProductByIdQuery(selected, {
//     skip: !selected,
//   });

//   console.log("Selected Product:", productById);
//   console.log("All Products:", products);

//   const handlePreview = ({ product }: any) => {
//     console.log(product, " handle");
//     // if (!product) return;

//     // setIsOpen(true);
//     // setSelected(product.id);
//   };

//   return (
//     <div>
//       <div className=" p-10 m-10 gap-8">
//         {products?.products.map((product: any) => (
//           <div
//             key={product.id}
//             // onClick={() => setSelected(product.id)}
//             // onClick={() => setIsOpen(true)}
//             onClick={() => handlePreview(product)}
//             className="cursor-pointer p-4 m-2 border"
//           >
//             <p>{product.title}</p>
//             <p>{product.description}</p>
//             <div>
//               {product.images.map((image: any) => (
//                 <div key={image.id}>
//                   <img
//                     src={image.url}
//                     alt={image.altText}
//                     className="w-90 h-90"
//                   />
//                   <p>{image.url}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//       <div>
//         {/* Trigger */}
//         {/* <button
//           onClick={() => setIsOpen(true)}
//           className="px-4 py-2 bg-blue-600 text-white rounded"
//         >
//           Open Modal
//         </button> */}

//         {/* Overlay + Modal */}
//         {isOpen && (
//           <div className="fixed inset-0 z-50 bg-black/5 flex items-center justify-center">
//             <div className=" p-6 rounded-xl shadow-xl max-w-sm w-full bg-sky-400">
//               <h2 className="text-lg font-semibold mb-4">Modal Title</h2>
//               {/* <p className="text-sm ">This is modal content.</p> */}
//               <div>abc</div>
//               <div className="mt-4 text-right">
//                 <button
//                   onClick={() => setIsOpen(false)}
//                   className="px-4 py-2 rounded hover:bg-gray-300"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//       <Sheet />
//     </div>
//   );
// };

// export default Product;

// const Sheet = () => {
//   const [open, setOpen] = useState(false);

//   return (
//     <>
//       {/* Trigger */}
//       <button
//         onClick={() => setOpen(true)}
//         className="px-4 py-2 bg-green-600 text-white rounded"
//       >
//         Open Sheet
//       </button>

//       {/* Overlay + Sheet */}
//       <div
//         className={`fixed inset-0 z-50 transition-transform duration-300 ${
//           open ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         {/* Backdrop */}
//         <div
//           className="absolute inset-0 bg-black/50"
//           onClick={() => setOpen(false)}
//         />

//         {/* Sheet Panel */}
//         <div className="absolute right-0 top-0 h-full w-80  shadow-lg p-6">
//           <h2 className="text-lg font-bold mb-4">Slide Sheet</h2>
//           <p className="text-sm text-gray-700">This is a sliding sheet.</p>
//           <div className="mt-6 text-right">
//             <button
//               onClick={() => setOpen(false)}
//               className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };
