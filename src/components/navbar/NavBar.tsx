import React from "react";
import { Link } from "react-router-dom";

// const NavBar: React.FC = () => {
//   return (
//     <div className="grid bg-amber-200 grid-cols-10 gap-2 w-full">
//       <div className="grid bg-amber-300 col-span-1">Ecommerce</div>
//       <div className="grid bg-amber-400 col-span-3">
//         <div className="grid row-span-4">
//           <Link to="/">Home</Link>
//           <Link to="/products">ProductList</Link>
//           <Link to="/product">Product</Link>
//         </div>
//       </div>
//       <div className="grid bg-amber-500 col-span-2">
//         <div>
//           <Link to="/signin">SignIn</Link>
//           <Link to="/signup">SignUp</Link>
//         </div>
//         <div>Account</div>
//         <div>CART</div>
//       </div>
//     </div>
//   );
// };

// export default NavBar;

const NavBar: React.FC = () => {
  return (
    // Main Navigation Container: Full width grid, responsive columns, amber background
    <nav className="grid  grid-cols-10 md:grid-cols-10 gap-2 w-full p-2 items-center">
      {/* Brand/Logo Section */}
      <div className="col-span-2 md:col-span-2p-2 flex items-center justify-center font-bold text-lg">
        Ecommerce
      </div>

      {/* Primary Navigation Links */}
      <div className="col-span-4 md:col-span-4  p-2">
        <ul className="flex space-x-4">
          {" "}
          {/* Flexbox for horizontal links */}
          <li>
            <Link to="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link to="/products" className="hover:underline">
              ProductList
            </Link>
          </li>
          <li>
            <Link to="/product" className="hover:underline">
              Product
            </Link>
            <Link to="/product_form" className="hover:underline">
              Product
            </Link>
          </li>
        </ul>
      </div>

      {/* User Actions & Cart */}
      <div className="col-span-4 md:col-span-4p-2 flex justify-end items-center space-x-6">
        {" "}
        {/* Align to end, add spacing */}
        <div className="flex space-x-4">
          {" "}
          {/* Flexbox for Sign In/Up links */}
          <Link to="/signin" className="hover:underline">
            SignIn
          </Link>
          <Link to="/signup" className="hover:underline">
            SignUp
          </Link>
        </div>
        <div className="font-medium">Account</div>{" "}
        {/* Can add a link here too if needed */}
        <div className="font-bold">CART</div>{" "}
        {/* Can add a link/icon here too */}
      </div>
    </nav>
  );
};

export default NavBar;
// import React from "react";
// import { Link } from "react-router-dom";
// import { ModeToggle } from "../theme/ModeToggle";
// import {
//   AppleIcon,
//   CarTaxiFront,
//   FormInput,
//   Home,
//   List,
//   ListOrderedIcon,
// } from "lucide-react";
// import Cart from "@/pages/Cart";

// const NavBar: React.FC = () => {
//   return (
//     <div className="flex justify-between items-center">
//       <div>ECOMMERCE</div>
//       <div className="flex space-x-8">
//         <Link to="/">
//           <Home />
//         </Link>
//         <Link to="/products">
//           <List />
//         </Link>
//         <Link to="/product">
//           <AppleIcon />
//         </Link>
//         <Link to="/signin">
//           <CarTaxiFront />
//         </Link>
//         <Link to="/newProduct">
//           <FormInput />
//         </Link>
//         <Link to="/cart">
//           <Cart />
//         </Link>
//         <Link to="/order-summary">
//           <ListOrderedIcon />
//         </Link>
//       </div>
//       <div className="">
//         <ModeToggle />
//       </div>
//     </div>
//   );
// };

// export default NavBar;
