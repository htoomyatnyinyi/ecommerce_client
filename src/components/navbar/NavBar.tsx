import React from "react";
import { Link } from "react-router-dom";
import { ModeToggle } from "../theme/ModeToggle";
import {
  CarTaxiFront,
  FormInput,
  Home,
  List,
  ListOrderedIcon,
} from "lucide-react";
import Cart from "@/pages/Cart";

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
        <Link to="/signin">
          <CarTaxiFront />
        </Link>
        <Link to="/newProduct">
          <FormInput />
        </Link>
        <Link to="/cart">
          <Cart />
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
