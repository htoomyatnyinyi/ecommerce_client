import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import type { RootState } from "@/redux/store/store";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Truck, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  useGetStripeConfigQuery,
  useCreatePaymentIntentMutation,
  useConfirmPaymentMutation,
} from "@/redux/query/productApi";
import { useGetAddressesQuery } from "@/redux/query/userApi";

// CheckoutForm Component handles the actual payment submission
const CheckoutForm = ({
  clientSecret,
  paymentIntentId,
  subtotal,
}: {
  clientSecret: string;
  paymentIntentId: string;
  subtotal: number;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [confirmPaymentApi, { isLoading: isConfirming }] =
    useConfirmPaymentMutation();

  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/order-success",
      },
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message || "An unexpected error occurred.");
      toast.error(error.message || "Payment failed");
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      // Confirm with backend
      try {
        await confirmPaymentApi({ paymentIntentId }).unwrap();
        toast.success("Order placed successfully!");
        navigate("/"); // Or to success page
      } catch (err: any) {
        toast.error("Order confirmation failed. Please contact support.");
        console.error(err);
      }
      setIsProcessing(false);
    } else {
      setMessage("Payment status: " + paymentIntent.status);
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {message && <div className="text-red-500 text-sm">{message}</div>}
      <Button
        type="submit"
        disabled={isProcessing || !stripe || !elements || isConfirming}
        size="xl"
        className="w-full h-16 rounded-4xl text-lg font-black group shadow-xl shadow-primary/20"
      >
        {isProcessing
          ? "Processing..."
          : `Secure Purchase — $${subtotal.toFixed(2)}`}
        {!isProcessing && (
          <ShieldCheck className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
        )}
      </Button>
      <p className="text-center text-xs text-muted-foreground mt-4">
        Your payment data is encrypted and secure. By placing an order, you
        agree to our Terms of Service.
      </p>
    </form>
  );
};

const Checkout: React.FC = () => {
  const { items } = useSelector((state: RootState) => state.cart);
  const subtotal = items.reduce(
    (sum, item) => sum + item.variant.price * item.quantity,
    0
  );

  const { data: configData, error: configError } = useGetStripeConfigQuery();
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);

  const [createPaymentIntent, { data: paymentData, error: paymentError }] =
    useCreatePaymentIntentMutation();

  const { data: addressesData } = useGetAddressesQuery();

  useEffect(() => {
    if (configData?.publishableKey) {
      console.log("Stripe Key Loaded:", configData.publishableKey);
      setStripePromise(loadStripe(configData.publishableKey));
    } else if (configError) {
      console.error("Failed to load Stripe config:", configError);
      toast.error("Failed to load payment system.");
    }
  }, [configData, configError]);

  // Initial Payment Intent Creation
  useEffect(() => {
    if (items.length > 0 && !paymentData && !paymentError) {
      console.log("Creating Payment Intent...");
      createPaymentIntent({})
        .unwrap()
        .then((res) => console.log("Payment Intent Created:", res))
        .catch((err) => {
          console.error("Payment Intent Failed:", err);
          toast.error("Could not initialize checkout.");
        });
    }
  }, [items, createPaymentIntent, paymentData, paymentError]);

  const clientSecret = paymentData?.clientSecret;
  const paymentIntentId = paymentData?.paymentIntentId;

  const defaultAddress = Array.isArray(addressesData)
    ? addressesData.find((a: any) => a.isDefault)
    : addressesData?.addresses?.find((a: any) => a.isDefault);

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
            <div className="space-y-8">
              {/* Shipping Information Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-primary p-2 rounded-lg text-primary-foreground">
                    <Truck className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold">Shipping Information</h2>
                </div>

                {defaultAddress ? (
                  <Card className="p-6 rounded-2xl border-2 border-primary/20 bg-primary/5">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-lg">Default Address</p>
                        <p className="text-muted-foreground">
                          {defaultAddress.street}
                        </p>
                        <p className="text-muted-foreground">
                          {defaultAddress.city}, {defaultAddress.state}{" "}
                          {defaultAddress.postalCode}
                        </p>
                        <p className="text-muted-foreground">
                          {defaultAddress.country}
                        </p>
                      </div>
                      <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        Linked
                      </div>
                    </div>
                  </Card>
                ) : (
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-xl text-yellow-600">
                    No default address found. Using backend defaults or please
                    update your profile.
                  </div>
                )}
              </div>

              {/* Payment Section */}
              <div className="space-y-6 pt-8">
                <h2 className="text-2xl font-bold">Payment Method</h2>
                {clientSecret && stripePromise ? (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm
                      clientSecret={clientSecret}
                      paymentIntentId={paymentIntentId}
                      subtotal={subtotal}
                    />
                  </Elements>
                ) : (
                  <div>Loading Payment...</div>
                )}
                {paymentError && (
                  <div className="text-red-500 bg-red-50 p-4 rounded-xl">
                    <p className="font-bold">Failed to initialize payment.</p>
                    <pre className="text-xs mt-2 overflow-auto">
                      {JSON.stringify(paymentError, null, 2)}
                    </pre>
                  </div>
                )}
                {configError && (
                  <div className="text-red-500 bg-red-50 p-4 rounded-xl">
                    <p className="font-bold">Configuration Error.</p>
                    <pre className="text-xs mt-2 overflow-auto">
                      {JSON.stringify(configError, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
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
                    <div className="h-20 w-20 rounded-xl overflow-hidden bg-muted shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="grow">
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
