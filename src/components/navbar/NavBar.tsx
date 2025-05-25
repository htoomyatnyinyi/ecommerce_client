import React from "react";
import { Link } from "react-router-dom";
import { ModeToggle } from "../theme/ModeToggle";
import { CarTaxiFront, Home, List, ListOrderedIcon } from "lucide-react";

const NavBar: React.FC = () => {
  return (
    <div className="flex justify-between items-center">
      <div>ECOMMERCE</div>
      <div className="flex space-x-8">
        <Link to="/">
          <Home />
        </Link>
        <Link to="/products">
          <List />
        </Link>
        <Link to="/cart">
          <CarTaxiFront />
        </Link>
        <Link to="/order-summary">
          <ListOrderedIcon />
        </Link>
      </div>
      <div className="">
        <ModeToggle />
      </div>
    </div>
  );
};

export default NavBar;
