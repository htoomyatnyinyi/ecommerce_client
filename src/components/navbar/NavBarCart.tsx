import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const NavbarCart = () => {
  const totalQuantity = useSelector(
    (state: RootState) => state.cart.totalQuantity
  );

  return (
    <Link
      to="/products/cart"
      className="relative group p-2 rounded-2xl hover:bg-secondary/50 transition-all duration-300"
    >
      <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform" />

      {totalQuantity > 0 && (
        <span
          className={cn(
            "absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-black italic shadow-lg shadow-primary/20 transition-all animate-in zoom-in duration-300",
            totalQuantity >= 10 && "w-6"
          )}
        >
          {totalQuantity}
        </span>
      )}

      {/* Subtle indicator dot */}
      <div className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
};

export default NavbarCart;
