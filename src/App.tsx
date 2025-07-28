import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/Routes.jsx";
import { Toaster } from "sonner";
// import { ThemeProvider } from "@/components/theme-provider";
import { ThemeProvider } from "./components/theme/theme-provider";

const App: React.FC = () => {
  return (
    <div>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        {/* // <div className="bg-white dark:bg-black dark:text-white text-cyan-900"> */}
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </div>
  );
};

export default App;
