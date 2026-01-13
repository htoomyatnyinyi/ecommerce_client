import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/utils/1.png";
import { NavigationBar } from "./NavigationBar";
import NavbarCart from "./NavBarCart";
import { ModeToggle } from "../theme/mode-toggle";
import { Menu, X, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NavBar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 px-4 md:px-8 py-4",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm py-3"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary p-1.5 rounded-xl group-hover:rotate-12 transition-transform duration-300">
              <img src={logo} alt="OASIS" className="h-7 w-7 invert" />
            </div>
            <span className="font-black text-2xl tracking-tighter italic">
              OASIS.
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <NavigationBar />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex rounded-full"
          >
            <Search className="h-5 w-5" />
          </Button>

          <Button
            asChild
            variant="ghost"
            size="icon"
            className="hidden md:flex rounded-full"
          >
            <Link to="/signin">
              <User className="h-5 w-5" />
            </Link>
          </Button>

          <NavbarCart />

          <div className="hidden md:block">
            <ModeToggle />
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-full"
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

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-background border-b border-border shadow-xl animate-in slide-in-from-top-4 duration-300">
          <div className="p-6 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                className="text-lg font-bold hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-lg font-bold hover:text-primary transition-colors"
              >
                Shop
              </Link>
              <Link
                to="/product_form"
                className="text-lg font-bold hover:text-primary transition-colors"
              >
                Sell Product
              </Link>
              <Link
                to="/dashboard"
                className="text-lg font-bold hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
            </div>
            <div className="pt-6 border-t border-border flex justify-between items-center">
              <div className="flex gap-4">
                <Link to="/signin" className="font-bold">
                  Sign In
                </Link>
                <Link to="/signup" className="font-bold text-primary">
                  Sign Up
                </Link>
              </div>
              <ModeToggle />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
