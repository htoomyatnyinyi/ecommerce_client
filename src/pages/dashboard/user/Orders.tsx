import React from "react";
import DashboardLayout from "../Dashboard";
import {
  Box,
  Search,
  Filter,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  Package,
  ArrowRight,
  Loader2,
  Badge,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  // CardTitle,
  // CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/redux/query/orderApi";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const UserOrders: React.FC = () => {
  const { data: orders, isLoading } = useGetOrdersQuery();
  const [updateOrderStatus, { isLoading: isUpdatingStatus }] =
    useUpdateOrderStatusMutation();
  const [selectedOrder, setSelectedOrder] = React.useState<any>(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = React.useState(false);

  const handleTrackParcel = (order: any) => {
    setSelectedOrder(order);
    setIsTrackingModalOpen(true);
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await updateOrderStatus({ id: orderId, status: "CANCELLED" }).unwrap();
      toast.success("Trajectory terminated. Order cancelled.");
    } catch (err: any) {
      toast.error(err?.data?.error || "Failed to terminate trajectory.");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-5xl font-black italic tracking-tighter mb-2">
              My <span className="text-primary">Orders.</span>
            </h1>
            <p className="text-muted-foreground text-lg font-medium">
              Track your deliveries and view order history.
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by order ID or product..."
              className="pl-12 h-14 rounded-2xl bg-secondary/20 border-border/50 focus-visible:ring-primary/20"
            />
          </div>
          <Button
            variant="outline"
            className="h-14 rounded-2xl px-6 font-bold gap-2"
          >
            <Filter className="w-5 h-5" />
            Filters
          </Button>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-40 rounded-4xl bg-secondary/10 animate-pulse"
                />
              ))}
            </div>
          ) : orders && orders.length > 0 ? (
            orders.map((order: any) => (
              <OrderCard
                key={order.id}
                order={order}
                onTrack={() => handleTrackParcel(order)}
                onCancel={() => handleCancelOrder(order.id)}
                isCancelling={isUpdatingStatus}
              />
            ))
          ) : (
            <Card className="rounded-[2.5rem] border-dashed border-border/50 bg-secondary/5 py-20 text-center">
              <div className="bg-primary/10 p-6 rounded-3xl w-fit mx-auto mb-6">
                <Package className="w-12 h-12 text-primary opacity-20" />
              </div>
              <h3 className="text-2xl font-black italic mb-2">No orders yet</h3>
              <p className="text-muted-foreground font-medium mb-8">
                Your oasis is waiting to be filled. Start shopping now!
              </p>
              <Button
                asChild
                className="rounded-2xl h-14 px-10 font-black italic"
              >
                <a href="/products">Go to Shop</a>
              </Button>
            </Card>
          )}
        </div>
      </div>

      {/* Tracking Modal */}
      <Dialog open={isTrackingModalOpen} onOpenChange={setIsTrackingModalOpen}>
        <DialogContent className="rounded-[2.5rem] max-w-2xl border-border/50 bg-background/95 backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black italic tracking-tighter">
              Parcel <span className="text-primary">Tracking.</span>
            </DialogTitle>
            <DialogDescription className="font-medium text-muted-foreground">
              Visualizing the trajectory of your acquisition.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6 max-h-[60vh] overflow-y-auto px-1 custom-scrollbar">
            {selectedOrder?.items?.map((item: any, idx: number) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-secondary/10 border border-border/10 space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-background border border-border/50 overflow-hidden shrink-0">
                      <img
                        src={
                          item.product?.images?.[0]?.url ||
                          `https://picsum.photos/seed/${item.id}/200`
                        }
                        className="w-full h-full object-cover"
                        alt={item.product?.title}
                      />
                    </div>
                    <div>
                      <h4 className="font-black italic text-sm">
                        {item.product?.title}
                      </h4>
                      <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">
                        {item.variant?.color} / {item.variant?.size} | Qty:{" "}
                        {item.quantity}
                      </p>
                    </div>
                  </div>
                  <Badge className="rounded-lg border font-black italic tracking-widest text-[10px] bg-primary/10 text-primary border-primary/20">
                    {item.status || "PENDING"}
                  </Badge>
                </div>

                <div className="pt-4 border-t border-border/20 flex flex-col gap-2">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-50">
                    Carrier Reference Code
                  </p>
                  <p className="font-mono text-sm font-bold bg-background/50 p-2 rounded-lg border border-border/10">
                    {item.trackingNumber ||
                      "Trajectory synchronization in progress..."}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              onClick={() => setIsTrackingModalOpen(false)}
              className="w-full h-14 rounded-2xl font-black italic text-lg shadow-xl shadow-primary/20"
            >
              Acknowledge Trajectory
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

const OrderCard = ({
  order,
  onTrack,
  onCancel,
  isCancelling,
}: {
  order: any;
  onTrack: () => void;
  onCancel: () => void;
  isCancelling: boolean;
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "DELIVERED":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "SHIPPED":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "PROCESSING":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "CANCELLED":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-secondary/50 text-muted-foreground border-border/50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "DELIVERED":
        return <CheckCircle2 className="w-4 h-4" />;
      case "PROCESSING":
        return <Clock className="w-4 h-4" />;
      case "CANCELLED":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Box className="w-4 h-4" />;
    }
  };

  return (
    <Card className="rounded-[2.5rem] border-border/50 bg-card hover:border-primary/30 transition-all overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/5">
      <CardHeader className="p-8 pb-4 border-b border-border/50 flex flex-row items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">
              Order Identifier
            </p>
            <h4 className="font-extrabold text-lg tracking-tight">
              #{order.id.slice(-8).toUpperCase()}
            </h4>
          </div>
          <div className="h-10 w-px bg-border/50 hidden sm:block" />
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">
              Date Placed
            </p>
            <p className="font-bold text-sm">
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span
            className={cn(
              "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border",
              getStatusColor(order.status)
            )}
          >
            {getStatusIcon(order.status)}
            {order.status}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl transition-transform hover:scale-110"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-8">
        <div className="flex flex-col lg:flex-row justify-between gap-10">
          <div className="flex-1 space-y-6">
            {order.items?.map((item: any) => (
              <div key={item.id} className="flex gap-6 items-center group">
                <div className="w-20 h-20 rounded-2xl bg-secondary/30 overflow-hidden shrink-0 border border-transparent group-hover:border-primary/20 transition-all">
                  <img
                    src={
                      item.product?.images?.find((img: any) => img.isPrimary)
                        ?.url ||
                      item.product?.images?.[0]?.url ||
                      `https://picsum.photos/seed/${item.id}/200`
                    }
                    alt={item.product?.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-lg truncate mb-1 group-hover:text-primary transition-colors">
                    {item.product?.title}
                  </h5>
                  <p className="text-sm text-muted-foreground font-medium">
                    Qty: {item.quantity} •{" "}
                    <span className="text-foreground font-black">
                      ${Number(item.price).toFixed(2)}
                    </span>{" "}
                    each
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:w-64 flex flex-col justify-between items-end gap-6 text-right">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">
                Total Amount
              </p>
              <p className="text-3xl font-black italic tracking-tighter text-primary">
                ${Number(order.totalPrice).toFixed(2)}
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full lg:w-auto">
              <Button
                variant="outline"
                onClick={onTrack}
                className="rounded-2xl font-black italic gap-2 w-full lg:w-auto px-8 h-14 border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all active:scale-95 shadow-lg shadow-primary/5"
              >
                Track Parcel
                <ArrowRight className="w-5 h-5" />
              </Button>

              {order.status === "PENDING" && (
                <Button
                  variant="ghost"
                  onClick={onCancel}
                  disabled={isCancelling}
                  className="rounded-2xl font-black italic gap-2 w-full lg:w-auto px-8 h-14 text-destructive hover:bg-destructive/10 transition-all opacity-60 hover:opacity-100"
                >
                  {isCancelling ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Terminate Trajectory"
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserOrders;
