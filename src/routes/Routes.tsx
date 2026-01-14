import React, { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  Outlet,
  Navigate,
  ScrollRestoration,
} from "react-router-dom";
import NavBar from "@/components/navbar/NavBar";
import { useAuthMeQuery } from "@/redux/query/authApi";
import { Loader2 } from "lucide-react";

// --- Lazy Load Pages ---
const Home = lazy(() => import("@/pages/Home"));
const SignUp = lazy(() => import("@/pages/auth/SignUp"));
const SignIn = lazy(() => import("@/pages/auth/SignIn"));
const VerifyEmail = lazy(() => import("@/pages/auth/VerifyEmail"));
const Products = lazy(() => import("@/pages/products/Products"));
const ProductDetails = lazy(() => import("@/pages/products/ProductDetails"));
const Cart = lazy(() => import("@/pages/carts/Cart"));
const Checkout = lazy(() => import("@/pages/carts/Checkout"));

const AdminDashboard = lazy(
  () => import("@/pages/dashboard/admin/AdminDashboard")
);
const ProductDashboard = lazy(
  () => import("@/pages/dashboard/admin/ProductDashboard")
);
const EmployerDashboard = lazy(
  () => import("@/pages/dashboard/employer/EmployerDashboard")
);
const UserDashboard = lazy(
  () => import("@/pages/dashboard/user/UserDashboard")
);
const ProductForm = lazy(() => import("@/components/product/ProductForm"));

const PageLoader = () => (
  <div className="h-[80vh] w-full flex items-center justify-center bg-background/50 backdrop-blur-sm">
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <Loader2 className="w-16 h-16 text-primary animate-spin opacity-20" />
        <Loader2 className="w-16 h-16 text-primary animate-spin absolute inset-0 [animation-duration:3s]" />
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black italic tracking-tighter animate-pulse">
          OASIS.
        </h2>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
          Loading Experience
        </p>
      </div>
    </div>
  </div>
);

const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) => {
  const { data: user, isLoading, isError } = useAuthMeQuery();

  if (isLoading) return <PageLoader />;
  if (isError || !user) return <Navigate to="/signin" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/" replace />;

  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading } = useAuthMeQuery();
  if (isLoading) return <PageLoader />;
  if (user) {
    const dashboardMap: Record<string, string> = {
      ADMIN: "/dashboard",
      EMPLOYER: "/employer/dashboard",
      USER: "/user/dashboard",
    };
    return <Navigate to={dashboardMap[user.role] || "/"} replace />;
  }
  return <>{children}</>;
};

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center p-8 bg-background">
    <h1 className="text-[10rem] font-black italic tracking-tighter opacity-10">
      404
    </h1>
    <h2 className="text-4xl font-black italic -mt-10 mb-8">
      Lost in <span className="text-primary">Oasis.</span>
    </h2>
    <a
      href="/"
      className="px-10 py-4 bg-primary text-primary-foreground rounded-2xl font-black italic"
    >
      Return Home
    </a>
  </div>
);

const AppLayout = () => (
  <div className="flex flex-col min-h-screen">
    <NavBar />
    <main className="flex-grow">
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </main>
    <ScrollRestoration />
  </div>
);

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      // --- Public Routes ---
      { path: "/", element: <Home /> },
      { path: "/products", element: <Products /> },
      { path: "/products/:id", element: <ProductDetails /> },
      { path: "/products/cart", element: <Cart /> },
      { path: "/verify-email", element: <VerifyEmail /> },

      // --- Guest Only ---
      {
        path: "/signin",
        element: (
          <PublicRoute>
            <SignIn />
          </PublicRoute>
        ),
      },
      {
        path: "/signup",
        element: (
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        ),
      },

      // --- Authenticated Shared ---
      {
        path: "/checkout",
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },

      // --- User Profile ---
      {
        path: "/user/dashboard",
        element: (
          <ProtectedRoute allowedRoles={["USER"]}>
            <UserDashboard />
          </ProtectedRoute>
        ),
      },

      // --- Merchant / Employer Console ---
      {
        path: "/employer",
        element: (
          <ProtectedRoute allowedRoles={["EMPLOYER", "ADMIN"]}>
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          { path: "dashboard", element: <EmployerDashboard /> },
          { path: "products/new", element: <ProductForm /> },
        ],
      },

      // --- Managed Product Route (Unified Path) ---
      {
        path: "/products/manage/new",
        element: (
          <ProtectedRoute allowedRoles={["EMPLOYER", "ADMIN"]}>
            <ProductForm />
          </ProtectedRoute>
        ),
      },

      // --- Admin Dashboard ---
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "products", element: <ProductDashboard /> },
          { path: "products/new", element: <ProductForm /> },
        ],
      },

      { path: "*", element: <NotFound /> },
    ],
  },
]);
