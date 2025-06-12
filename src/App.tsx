import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/Routes.jsx";
import { Toaster } from "sonner";
const App: React.FC = () => {
  return (
    <div>
      {/* // <div className="bg-white dark:bg-black dark:text-white text-cyan-900"> */}
      <RouterProvider router={router} />
      <Toaster />
    </div>
  );
};

export default App;
