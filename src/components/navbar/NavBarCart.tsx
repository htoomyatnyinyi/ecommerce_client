import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";
// import { ShoppingCartIcon } from '@heroicons/react/24/outline'; // Example icon

const NavbarCart = () => {
  // Subscribe to the totalQuantity from the cart slice
  const totalQuantity = useSelector(
    (state: RootState) => state.cart.totalQuantity
  );

  return (
    <button className="relative">
      {/* <ShoppingCartIcon className="h-6 w-6" /> */}
      SHOPPING CART
      {totalQuantity > 0 && (
        <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs">
          {totalQuantity}
        </span>
      )}
    </button>
  );
};

export default NavbarCart;

// Then, add <NavbarCart /> to your main layout or header component.
