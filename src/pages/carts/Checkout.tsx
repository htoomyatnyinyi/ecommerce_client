import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import type { RootState } from "@/redux/store/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CreditCard, Truck, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items } = useSelector((state: RootState) => state.cart);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const subtotal = items.reduce(
    (sum, item) => sum + item.variant.price * item.quantity,
    0
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty!");
      navigate("/products");
      return;
    }

    // Simulate order placement
    toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
      loading: "Processing your order...",
      success: () => {
        navigate("/");
        return "Order placed successfully! Thank you for shopping with OASIS.";
      },
      error: "Failed to place order. Please try again.",
    });
  };

  return (
    <div className="bg-background min-h-screen pt-24 pb-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center gap-4 mb-12">
          <Link
            to="/products/cart"
            className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold">Back to Bag</span>
          </Link>
        </div>

        <h1 className="text-5xl font-black italic tracking-tighter mb-12">
          Checkout.
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-primary p-2 rounded-lg text-primary-foreground">
                    <Truck className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold">Shipping Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    name="name"
                    placeholder="Full Name"
                    onChange={handleInputChange}
                    className="h-14 rounded-2xl border-2 focus-visible:ring-primary/20"
                    required
                  />
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    onChange={handleInputChange}
                    className="h-14 rounded-2xl border-2 focus-visible:ring-primary/20"
                    required
                  />
                </div>
                <Input
                  name="address"
                  placeholder="Street Address"
                  onChange={handleInputChange}
                  className="h-14 rounded-2xl border-2 focus-visible:ring-primary/20"
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    name="city"
                    placeholder="City"
                    onChange={handleInputChange}
                    className="h-14 rounded-2xl border-2 focus-visible:ring-primary/20"
                    required
                  />
                  <Input
                    name="postalCode"
                    placeholder="Postal Code"
                    onChange={handleInputChange}
                    className="h-14 rounded-2xl border-2 focus-visible:ring-primary/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-6 pt-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-primary p-2 rounded-lg text-primary-foreground">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold">Payment Method</h2>
                </div>
                <Card className="p-6 rounded-2xl border-2 border-primary bg-primary/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-background p-2 rounded-lg">
                      <CreditCard className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold">Credit / Debit Card</p>
                      <p className="text-xs text-muted-foreground">
                        Secure payment via Stripe
                      </p>
                    </div>
                  </div>
                  <div className="h-4 w-4 rounded-full border-4 border-primary bg-primary" />
                </Card>
              </div>

              <div className="pt-8">
                <Button
                  type="submit"
                  size="xl"
                  className="w-full h-16 rounded-[2rem] text-lg font-black group shadow-xl shadow-primary/20"
                >
                  Secure Purchase — ${subtotal.toFixed(2)}
                  <ShieldCheck className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                </Button>
                <p className="text-center text-xs text-muted-foreground mt-4">
                  Your payment data is encrypted and secure. By placing an
                  order, you agree to our Terms of Service.
                </p>
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5">
            <Card className="p-10 rounded-[2.5rem] border-border/50 bg-secondary/10 sticky top-24">
              <h2 className="text-3xl font-black italic tracking-tighter mb-8">
                Order Details
              </h2>

              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 mb-8 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="h-20 w-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="font-bold truncate max-w-[200px]">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Size: {item.variant.size} • Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-black">
                      ${(item.variant.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>
                <Separator className="my-4 bg-border/50" />
                <div className="flex justify-between items-center font-black text-2xl">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
