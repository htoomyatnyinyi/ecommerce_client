import { createBrowserRouter, Outlet, Navigate } from "react-router-dom";
import NavBar from "@/components/navbar/NavBar";
import Home from "@/pages/Home";
import SignUp from "@/pages/auth/SignUp";
import SignIn from "@/pages/auth/SignIn";
import VerifyEmail from "@/pages/auth/VerifyEmail";
import Product from "@/pages/Product";
import ProductForm from "@/components/product/ProductForm";
import AdminDashboard from "@/pages/dashboard/admin/AdminDashboard";
import ProductDashboard from "@/pages/dashboard/admin/ProductDashboard";
import EmployerDashboard from "@/pages/dashboard/employer/EmployerDashboard";
import UserDashboard from "@/pages/dashboard/user/UserDashboard";

import Products from "@/pages/products/Products";
import ProductDetails from "@/pages/products/ProductDetails";
import Cart from "@/pages/carts/Cart";
import Checkout from "@/pages/carts/Checkout";
import { useAuthMeQuery } from "@/redux/query/authApi";
import { Loader2 } from "lucide-react";

/**
 * Loading Screen for Auth Checks
 */
const AuthLoading = () => (
  <div className="h-screen w-full flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
      <p className="font-bold italic animate-pulse">
        Establishing secure connection...
      </p>
    </div>
  </div>
);

/**
 * ProtectedRoute Component
 * Handles authentication and role-based access control
 */
const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) => {
  const { data: user, isLoading, isError } = useAuthMeQuery();

  if (isLoading) return <AuthLoading />;

  if (isError || !user) {
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect unauthorized users back to home or a common dashboard
    console.warn(
      `Unauthorized access attempt by ${user.role} to restricted route.`
    );
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const NotFound = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-4 h-screen">
      <h1 className="text-6xl font-black italic tracking-tighter mb-4">
        404 - <span className="text-primary">Lost.</span>
      </h1>
      <p className="text-xl font-medium text-muted-foreground mb-8">
        The page you are looking for has drifted away from our oasis.
      </p>
      <Navigate to="/" />
    </div>
  );
};

const AppLayout = () => (
  <>
    <NavBar />
    <main className="">
      <Outlet />
    </main>
  </>
);

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      // --- Public Routes ---
      { path: "/", element: <Home /> },
      { path: "/signin", element: <SignIn /> },
      { path: "/signup", element: <SignUp /> },
      { path: "/product", element: <Product /> },
      { path: "/products", element: <Products /> },
      { path: "/products/:id", element: <ProductDetails /> },
      { path: "/products/cart", element: <Cart /> },
      { path: "/verify-email", element: <VerifyEmail /> },

      // --- Authenticated Shared Routes ---
      {
        path: "/checkout",
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },

      // --- Admin Exclusive Routes ---
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/products",
        element: (
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <ProductDashboard />
          </ProtectedRoute>
        ),
      },

      // --- Employer Exclusive Routes ---
      {
        path: "/employer/dashboard",
        element: (
          <ProtectedRoute allowedRoles={["EMPLOYER"]}>
            <EmployerDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/product_form",
        element: (
          <ProtectedRoute allowedRoles={["EMPLOYER", "ADMIN"]}>
            <ProductForm />
          </ProtectedRoute>
        ),
      },

      // --- User Exclusive Routes ---
      {
        path: "/user/dashboard",
        element: (
          <ProtectedRoute allowedRoles={["USER"]}>
            <UserDashboard />
          </ProtectedRoute>
        ),
      },

      // --- Catch-all ---
      { path: "*", element: <NotFound /> },
    ],
  },
]);
