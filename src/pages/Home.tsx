import React from "react";
import Hero from "@/components/hero/Hero";
import FeaturedCategories from "@/components/category/FeaturedCategories";
import TrendingProducts from "@/components/product/TrendingProducts";
import Newsletter from "@/components/home/Newsletter";
import { MoveRight } from "lucide-react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />

      {/* Brands Ticker (Optional aesthetic addition) */}
      <div className="py-12 border-y border-border/50 bg-background overflow-hidden relative">
        <div className="flex animate-scroll whitespace-nowrap gap-16 md:gap-32 items-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
          {[
            "VOGUE",
            "HARPER'S BAZAAR",
            "GQ",
            "ELLE",
            "WWD",
            "COSMOPOLITAN",
          ].map((brand) => (
            <span
              key={brand}
              className="text-2xl md:text-3xl font-black italic tracking-tighter"
            >
              {brand}
            </span>
          ))}
          {/* Duplicate for seamless loop */}
          {[
            "VOGUE",
            "HARPER'S BAZAAR",
            "GQ",
            "ELLE",
            "WWD",
            "COSMOPOLITAN",
          ].map((brand) => (
            <span
              key={brand + "-2"}
              className="text-2xl md:text-3xl font-black italic tracking-tighter"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>

      <FeaturedCategories />

      {/* Seasonal Promotion Section */}
      <section className="container mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="group relative h-[400px] md:h-[600px] rounded-3xl overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop"
              alt="Shoe Collection"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
            <div className="absolute inset-0 p-12 flex flex-col justify-end">
              <span className="text-white/80 font-bold uppercase tracking-widest mb-4">
                Summer Essentials
              </span>
              <h3 className="text-white text-4xl md:text-5xl font-black mb-6 italic">
                Step into <br /> Tomorrow
              </h3>
              <Link
                to="/products"
                className="flex items-center text-white font-bold group/link"
              >
                Shop Footwear{" "}
                <MoveRight className="ml-2 transition-transform group-hover/link:translate-x-2" />
              </Link>
            </div>
          </div>
          <div className="group relative h-[400px] md:h-[600px] rounded-3xl overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1976&auto=format&fit=crop"
              alt="Accessories"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
            <div className="absolute inset-0 p-12 flex flex-col justify-end">
              <span className="text-white/80 font-bold uppercase tracking-widest mb-4">
                Limited Edition
              </span>
              <h3 className="text-white text-4xl md:text-5xl font-black mb-6">
                Accentuate <br /> Your Aura
              </h3>
              <Link
                to="/products"
                className="flex items-center text-white font-bold group/link"
              >
                Explore Accessories{" "}
                <MoveRight className="ml-2 transition-transform group-hover/link:translate-x-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <TrendingProducts />

      <Newsletter />

      {/* Footer Info */}
      <section className="py-24 border-t border-border/50">
        <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h4 className="text-2xl font-black italic tracking-tighter mb-6">
              OASIS.
            </h4>
            <p className="text-muted-foreground text-lg max-w-sm">
              Crafting premium experiences since 2024. We believe in quality,
              sustainability, and timeless design.
            </p>
          </div>
          <div>
            <h5 className="font-bold mb-6 uppercase tracking-widest text-sm">
              Shop
            </h5>
            <ul className="space-y-4 text-muted-foreground">
              <li>
                <Link
                  to="/products"
                  className="hover:text-primary transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Fashion"
                  className="hover:text-primary transition-colors"
                >
                  Fashion
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Tech"
                  className="hover:text-primary transition-colors"
                >
                  Technology
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Home"
                  className="hover:text-primary transition-colors"
                >
                  Living
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-6 uppercase tracking-widest text-sm">
              Company
            </h5>
            <ul className="space-y-4 text-muted-foreground">
              <li>
                <Link
                  to="/about"
                  className="hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 md:px-8 mt-24 pt-8 border-t border-border/20 text-center text-muted-foreground text-sm">
          <p>
            © 2024 OASIS Ecommerce. Crafted with passion by HTOO MYAT NYI NYI.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
