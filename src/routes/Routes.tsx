import { createBrowserRouter, Outlet } from "react-router-dom"; // Keep Outlet
import NavBar from "@/components/navbar/NavBar";
import Home from "@/pages/Home";
import SignUp from "@/pages/auth/SignUp";
import SignIn from "@/pages/auth/SignIn";
import VerifyEmail from "@/pages/VerifyEmail";
import Product from "@/pages/Product";

// import { NavigationBar } from "@/components/navbar/NavigationBar";
const NotFound = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-4xl font-bold mb-2">404 - Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
};

// const ProtectedRoute = ({ allowedRoles, children }) => {
//   const { data, isLoading, isError } = useAuthMeQuery(null);

//   if (isLoading) return <div>Loading...</div>;

//   if (isError || !data?.user) {
//     return <Navigate to="/signin" replace />;
//   }

//   if (!allowedRoles.includes(data.user.role)) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };
// ######
// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const { data, isLoading, isError } = useAuthMeQuery();
//   // console.log(user, "at protective", allowedRoles);
//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (isError || !data.user) {
//     // Redirect unauthenticated users to login
//     return <Navigate to="/login" replace />;
//   }

//   if (!allowedRoles.includes(data.user.role)) {
//     // Redirect unauthorized users to home
//     console.log(
//       `User with role '${
//         data.user.role
//       }' tried to access a route restricted to roles: ${allowedRoles.join(
//         ", "
//       )}`
//     );
//     return <Navigate to="/" replace />;
//   }

//   // console.log(!allowedRoles.includes(user.role), "at protective");

//   return children;
// };

// export default ProtectedRoute;

// Keep AppLayout as it is
const AppLayout = () => (
  <>
    {/* <NavigationBar /> */}
    <NavBar />
    <main className="">
      {/* <main className="pt-16"> */}
      {/* Adjust padding as needed */}
      <Outlet /> {/* Renders the matched child route component */}
    </main>
  </>
);

export const router = createBrowserRouter([
  {
    element: <AppLayout />, // AppLayout provides Navbar and Outlet
    children: [
      // --- Public Routes ---
      {
        path: "/",
        element: <Home />,
      },

      {
        path: "/signin",
        element: <SignIn />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/product",
        element: <Product />,
      },

      {
        path: "/verify-email/", // Assuming public, adjust if needed
        element: <VerifyEmail />,
      },

      // {
      //   path: "/products", // Assuming public, adjust if needed
      //   element: <ProductList />,
      // },

      // // --- Employer Routes (Protected) ---
      // {
      //   path: "/dashboard/employer",
      //   element: (
      //     <ProtectedRoute allowedRoles={["employer"]}>
      //       <Employer />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: "/profile/employer",
      //   element: (
      //     <ProtectedRoute allowedRoles={["employer"]}>
      //       <EmployerProfile />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: "/employer/post-job",
      //   element: (
      //     <ProtectedRoute allowedRoles={["employer"]}>
      //       <JobDashboard />
      //     </ProtectedRoute>
      //   ),
      // },

      // // --- Job Seeker Routes (Example - Add if needed) ---
      // {
      //   path: "/user/dashboard",
      //   element: (
      //     <ProtectedRoute allowedRoles={["user"]}>
      //       <UserDashboard /> {/* Create this component */}
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: "/user/profile",
      //   element: (
      //     <ProtectedRoute allowedRoles={["user"]}>
      //       <UserProfile /> {/* Create this component */}
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: "/user/resume",
      //   element: (
      //     <ProtectedRoute allowedRoles={["user"]}>
      //       <Resume /> {/* Create this component */}
      //     </ProtectedRoute>
      //   ),
      // },

      // --- Admin Routes (Example - Add if needed) ---
      // {
      //   path: "/admin/dashboard",
      //   element: (
      //     <ProtectedRoute allowedRoles={['admin']}>
      //       <AdminDashboard /> Create this component
      //     </ProtectedRoute>
      //   ),
      // },

      // --- Catch-all Not Found Route ---
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  // You could potentially have routes outside the AppLayout if needed
  // For example, a dedicated fullscreen login page without the main navbar
  // {
  //   path: "/alternative-login",
  //   element: <AlternativeLoginPage />
  // }
]);
