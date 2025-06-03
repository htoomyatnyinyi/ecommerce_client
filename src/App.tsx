import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/Routes.jsx";

const App: React.FC = () => {
  return (
    <div>
      {/* // <div className="bg-white dark:bg-black dark:text-white text-cyan-900"> */}
      <RouterProvider router={router} />
    </div>
  );
};

export default App;

// import { useState } from 'react';
// import ProductForm from './components/ProductForm';
// import CategoryForm from './components/CategoryForm';

// function App() {
//   const [activeTab, setActiveTab] = useState('product');

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-3xl font-bold text-center mb-6">Product Management</h1>
//         <div className="flex justify-center mb-6">
//           <button
//             className={`px-4 py-2 mr-2 rounded-lg ${activeTab === 'product' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
//             onClick={() => setActiveTab('product')}
//           >
//             Create Product
//           </button>
//           <button
//             className={`px-4 py-2 rounded-lg ${activeTab === 'category' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
//             onClick={() => setActiveTab('category')}
//           >
//             Create Category
//           </button>
//         </div>
//         {activeTab === 'product' ? <ProductForm /> : <CategoryForm />}
//       </div>
//     </div>
//   );
// }

// export default App;
