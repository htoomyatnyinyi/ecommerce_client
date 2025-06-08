import React from "react";
import { NavigationBar } from "./NavigationBar";
import logo from "@/assets/utils/1.png";
import { Link } from "react-router-dom";

const NavBar: React.FC = () => {
  return (
    // Main Navigation Container: Full width grid, responsive columns, amber background
    <nav className="grid  grid-cols-10 md:grid-cols-10 gap-2 w-full p-2 items-center">
      <div className="col-span-2 md:col-span-2p-2 flex items-center justify-center font-bold text-lg">
        <Link to="/">
          <img
            src={logo}
            alt="loogo"
            height={40}
            width={40}
            className="dark:invert"
          />
        </Link>
      </div>

      {/* Primary Navigation Links */}
      <div className="col-span-4 md:col-span-4  p-2">
        <NavigationBar />
      </div>

      {/* User Actions & Cart */}
      <div className="col-span-4 md:col-span-4p-2 flex justify-end items-center space-x-6">
        <div className="font-bold">CART</div>{" "}
      </div>
    </nav>
  );
};

export default NavBar;
