import React from "react";
import { Link } from "react-router-dom";
import { ModeToggle } from "../theme/ModeToggle";

const NavBar: React.FC = () => {
  return (
    <div className="flex justify-between items-center">
      <div>ECOMMERCE</div>
      <div className="flex">
        <li>
          <Link to="/products">Product</Link>
        </li>
        <li>
          <Link to="/cart">Product</Link>
        </li>
        <li>
          <Link to="/order-summary">OrderSummary</Link>
        </li>
        <li>D</li>
      </div>
      <div className="">
        <ModeToggle />
      </div>
    </div>
  );
};

export default NavBar;
