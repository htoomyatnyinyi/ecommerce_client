import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { RootState } from "@/redux/store/store";
import {
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
  useGetCartQuery,
} from "@/redux/query/productApi";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const Cart: React.FC = () => {
  const { items } = useSelector((state: RootState) => state.cart);
  const { isLoading: isFetchingCart } = useGetCartQuery();

  const [removeCartItem] = useRemoveCartItemMutation();

  const subtotal = useMemo(() => {
    return items.reduce(
      (total, item) => total + item.variant.price * item.quantity,
      0
    );
  }, [items]);

  const handleRemove = async (cartItemId: string) => {
    try {
      await removeCartItem({ removeCartItemId: cartItemId }).unwrap();
      toast.success("Item removed from cart");
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  if (isFetchingCart && items.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <ShoppingBag className="w-12 h-12 text-primary animate-pulse" />
          <p className="font-bold italic">Gathering your items...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 mt-16">
        <div className="bg-secondary/30 p-8 rounded-full mb-8">
          <ShoppingBag className="w-16 h-16 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-black italic tracking-tighter mb-4">
          Your Bag is Empty
        </h1>
        <p className="text-muted-foreground mb-8 text-center max-w-sm">
          Looks like you haven't added anything to your bag yet. Let's find
          something special for you.
        </p>
        <Button asChild className="rounded-full px-12 h-14 text-md">
          <Link to="/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pt-24 pb-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center gap-4 mb-12">
          <Link
            to="/products"
            className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold">Keep Shopping</span>
          </Link>
        </div>

        <h1 className="text-5xl font-black italic tracking-tighter mb-12 text-center md:text-left">
          Your Bag.
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-6">
            {items.map((item) => (
              <Card
                key={item.id}
                className="p-6 rounded-[2rem] border-border/50 bg-secondary/10 flex flex-col sm:flex-row items-center gap-8 group overflow-hidden relative"
              >
                <div className="relative h-40 w-40 rounded-2xl overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <div className="flex-grow space-y-2 text-center sm:text-left">
                  <Badge
                    variant="outline"
                    className="mb-1 rounded-full text-[10px] font-bold uppercase tracking-widest border-primary/30 text-primary"
                  >
                    In Stock
                  </Badge>
                  <h3 className="text-2xl font-black leading-tight truncate max-w-[250px]">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground font-bold">
                    Size:{" "}
                    <span className="text-foreground">{item.variant.size}</span>
                  </p>
                  <p className="text-2xl font-black mt-2">
                    ${item.variant.price}
                  </p>
                </div>

                <div className="flex flex-col items-center sm:items-end gap-6">
                  <QuantityUpdater
                    initialQuantity={item.quantity}
                    cartItemId={item.id}
                  />
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="flex items-center gap-2 text-destructive hover:text-destructive/80 transition-colors font-bold text-sm uppercase tracking-widest"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <Card className="p-10 rounded-[2.5rem] border-border/50 bg-background shadow-2xl sticky top-24">
              <h2 className="text-3xl font-black italic tracking-tighter mb-8">
                Summary
              </h2>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-bold">
                    Subtotal
                  </span>
                  <span className="font-black text-xl">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-bold">
                    Shipping
                  </span>
                  <span className="text-green-600 font-black">FREE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-bold">Taxes</span>
                  <span className="font-black">Calculated at checkout</span>
                </div>

                <Separator className="bg-border/50" />

                <div className="flex justify-between items-center pt-2">
                  <span className="text-xl font-black">Total</span>
                  <span className="text-3xl font-black">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-10 space-y-4">
                <Button
                  asChild
                  size="lg"
                  className="w-full h-16 rounded-2xl text-lg font-black group shadow-xl shadow-primary/20"
                >
                  <Link
                    to="/checkout"
                    className="flex items-center justify-center gap-2"
                  >
                    Checkout Now
                    <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </Link>
                </Button>
                <div className="flex flex-col items-center gap-4 pt-6">
                  <p className="text-xs text-muted-foreground text-center">
                    Official Partner of Stripe for Secure Payments.
                  </p>
                  <div className="flex gap-4 grayscale opacity-50">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
                      alt="Stripe"
                      className="h-4"
                    />
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                      alt="Visa"
                      className="h-4"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

interface Props {
  initialQuantity: number;
  cartItemId: string;
}

const QuantityUpdater: React.FC<Props> = ({ initialQuantity, cartItemId }) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [updateCartItem, { isLoading: isUpdating }] =
    useUpdateCartItemMutation();

  // Keep local state in sync with server data
  React.useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

  const handleUpdate = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
    try {
      await updateCartItem({ cartItemId, quantity: newQuantity }).unwrap();
    } catch (err) {
      toast.error("Failed to update quantity");
      setQuantity(initialQuantity); // Rollback
    }
  };

  return (
    <div className="flex items-center gap-4 bg-background border-2 border-border/50 rounded-2xl p-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-xl"
        onClick={() => handleUpdate(quantity - 1)}
        disabled={isUpdating || quantity <= 1}
      >
        <Minus className="w-4 h-4" />
      </Button>
      <span className="w-8 text-center font-black text-lg">
        {isUpdating ? "..." : quantity}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-xl"
        onClick={() => handleUpdate(quantity + 1)}
        disabled={isUpdating}
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default Cart;
