import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/utils/1.png";
import { NavigationBar } from "./NavigationBar";
import NavbarCart from "./NavBarCart";
import { ModeToggle } from "../theme/mode-toggle";
import {
  Menu,
  X,
  User,
  Search,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthMeQuery, useSignOutMutation } from "@/redux/query/authApi";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NavBar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { data: user, isLoading: isAuthLoading } = useAuthMeQuery();
  const [signOut] = useSignOutMutation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await signOut().unwrap();
      toast.success("Logged out successfully");
      navigate("/signin");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const getDashboardPath = () => {
    if (!user) return "/dashboard";
    if (user.role === "ADMIN") return "/dashboard";
    if (user.role === "EMPLOYER") return "/employer/dashboard";
    return "/user/dashboard";
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-500 px-4 md:px-8 py-4",
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-lg py-3"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-primary p-2 rounded-2xl group-hover:rotate-12 transition-all duration-300 shadow-lg shadow-primary/20">
              <img src={logo} alt="OASIS" className="h-6 w-6 invert" />
            </div>
            <span className="font-black text-3xl tracking-tighter italic">
              OASIS.
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <NavigationBar />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex rounded-2xl hover:bg-secondary/50"
          >
            <Search className="h-5 w-5" />
          </Button>

          {isAuthLoading ? (
            <div className="h-10 w-10 rounded-full bg-secondary/30 animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full p-0 overflow-hidden border-2 border-primary/20 hover:border-primary transition-all"
                >
                  <div className="bg-primary/10 h-full w-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 mt-2 rounded-2xl p-2 bg-background/95 backdrop-blur-md border-border/50 shadow-2xl"
                align="end"
              >
                <DropdownMenuLabel className="font-black italic px-4 py-3">
                  <p className="text-sm">Store Account</p>
                  <p className="text-xs text-muted-foreground font-medium truncate">
                    {user.email}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem
                  asChild
                  className="rounded-xl px-4 py-2 cursor-pointer focus:bg-primary focus:text-primary-foreground group transition-all"
                >
                  <Link
                    to={getDashboardPath()}
                    className="flex items-center gap-3"
                  >
                    <LayoutDashboard className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span className="font-bold uppercase tracking-widest text-[10px]">
                      Dashboard
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="rounded-xl px-4 py-2 cursor-pointer focus:bg-primary focus:text-primary-foreground group transition-all"
                >
                  <Link to="/user/orders" className="flex items-center gap-3">
                    <ShoppingBag className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span className="font-bold uppercase tracking-widest text-[10px]">
                      My Orders
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="rounded-xl px-4 py-2 cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    <span className="font-bold uppercase tracking-widest text-[10px]">
                      Sign Out
                    </span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              variant="default"
              className="rounded-2xl font-black italic shadow-xl shadow-primary/10 h-10 px-6"
            >
              <Link to="/signin">Sign In</Link>
            </Button>
          )}

          <NavbarCart />

          <div className="hidden md:block">
            <ModeToggle />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-2xl hover:bg-secondary/50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-background border-b border-border shadow-2xl animate-in slide-in-from-top-4 duration-500 rounded-b-[2.5rem] overflow-hidden">
          <div className="p-8 flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              <MobileNavLink to="/" label="Home" />
              <MobileNavLink to="/products" label="Shop" />
              <MobileNavLink to="/product_form" label="Sell Product" />
              <MobileNavLink to={getDashboardPath()} label="Dashboard" />
            </div>

            <div className="pt-8 border-t border-border flex justify-between items-center">
              {user ? (
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="rounded-xl font-black italic px-8"
                >
                  Logout
                </Button>
              ) : (
                <div className="flex gap-4">
                  <Link
                    to="/signin"
                    className="font-black italic text-lg pr-4 border-r border-border"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="font-black italic text-lg text-primary"
                  >
                    Join Now
                  </Link>
                </div>
              )}
              <ModeToggle />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const MobileNavLink = ({ to, label }: { to: string; label: string }) => (
  <Link
    to={to}
    className="text-2xl font-black italic tracking-tighter hover:text-primary transition-all hover:translate-x-2"
  >
    {label}
  </Link>
);

export default NavBar;
