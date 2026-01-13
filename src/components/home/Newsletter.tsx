import React from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Newsletter: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 -z-10" />
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto bg-background rounded-[3rem] p-8 md:p-16 border border-border/50 shadow-2xl relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full -ml-16 -mb-16 blur-2xl" />

          <div className="text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Join the <span className="text-primary italic">A-List</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              Subscribe to stay updated with new collections, exclusive offers,
              and the latest trends from our universe.
            </p>

            <form
              className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <Input
                type="email"
                placeholder="Enter your email"
                className="h-14 rounded-full px-8 text-md border-2 focus-visible:ring-primary/20"
              />
              <Button
                size="lg"
                className="h-14 rounded-full px-8 text-md group"
              >
                Subscribe
                <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </form>
            <p className="mt-6 text-xs text-muted-foreground">
              By subscribing, you agree to our Privacy Policy and consent to
              receive marketing emails.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
