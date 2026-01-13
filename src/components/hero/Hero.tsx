import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { MoveRight, ShoppingBag } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";

const Hero: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-title", {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
      })
        .from(
          ".hero-desc",
          {
            y: 50,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.5"
        )
        .from(
          ".hero-btns",
          {
            y: 30,
            opacity: 0,
            duration: 0.6,
          },
          "-=0.4"
        )
        .from(
          ".hero-image",
          {
            scale: 0.8,
            opacity: 0,
            duration: 1.2,
            ease: "expo.out",
          },
          "-=1"
        );
    },
    { scope: container }
  );

  return (
    <section
      ref={container}
      className="relative min-h-[90vh] flex items-center overflow-hidden bg-background pt-20"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-full h-full -z-10 group">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl transition-all duration-1000 group-hover:bg-primary/20" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-3xl transition-all duration-1000 group-hover:bg-secondary/20" />
      </div>

      <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-secondary text-secondary-foreground mb-4">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            New Winter Collection 2024
          </div>

          <h1 className="hero-title text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Elevate Your <span className="text-primary italic">Style</span>{" "}
            <br />
            Define Your <span className="text-primary">Era</span>
          </h1>

          <p className="hero-desc text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Discover a curated collection of premium essentials designed for
            those who demand excellence in every detail.
          </p>

          <div className="hero-btns flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 h-14 text-md group"
            >
              <Link to="/products">
                Shop Collection
                <ShoppingBag className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-8 h-14 text-md group"
            >
              <Link to="/about">
                Our Story
                <MoveRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="hero-stats pt-8 flex gap-8 justify-center lg:justify-start border-t border-border/50">
            <div>
              <p className="text-2xl font-bold">15k+</p>
              <p className="text-sm text-muted-foreground">Premium Products</p>
            </div>
            <div>
              <p className="text-2xl font-bold">98%</p>
              <p className="text-sm text-muted-foreground">Happy Customers</p>
            </div>
          </div>
        </div>

        <div className="hero-image relative hidden lg:block">
          <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl bg-muted aspect-[4/5] flex items-center justify-center">
            {/* We'll use a placeholder or better yet, a generated image here later if needed */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent" />
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
              alt="Hero Fashion"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          {/* Floating Card */}
          <div className="absolute -bottom-6 -left-6 bg-background/80 backdrop-blur-md p-6 rounded-xl border border-border shadow-xl z-20 animate-bounce-slow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Trending Now
                </p>
                <p className="text-lg font-bold">Luxe Winter Coat</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
