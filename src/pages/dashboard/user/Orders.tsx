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
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetOrdersQuery } from "@/redux/query/orderApi";
import { cn } from "@/lib/utils";

const UserOrders: React.FC = () => {
  const { data: orders, isLoading } = useGetOrdersQuery();

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
                  className="h-40 rounded-[2rem] bg-secondary/10 animate-pulse"
                />
              ))}
            </div>
          ) : orders && orders.length > 0 ? (
            orders.map((order: any) => (
              <OrderCard key={order.id} order={order} />
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
    </DashboardLayout>
  );
};

const OrderCard = ({ order }: { order: any }) => {
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
    <Card className="rounded-[2.5rem] border-border/50 bg-card hover:border-primary/30 transition-all overflow-hidden">
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
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-8">
        <div className="flex flex-col lg:flex-row justify-between gap-10">
          <div className="flex-1 space-y-6">
            {order.items?.map((item: any) => (
              <div key={item.id} className="flex gap-6 items-center">
                <div className="w-20 h-20 rounded-2xl bg-secondary/30 overflow-hidden flex-shrink-0">
                  <img
                    src={
                      item.product?.images?.[0]?.url ||
                      `https://picsum.photos/seed/${item.id}/200`
                    }
                    alt={item.product?.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-lg truncate mb-1">
                    {item.product?.title}
                  </h5>
                  <p className="text-sm text-muted-foreground font-medium">
                    Qty: {item.quantity} • ${item.price} each
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:w-48 flex flex-col justify-between items-end gap-6 text-right">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">
                Total Amount
              </p>
              <p className="text-3xl font-black italic tracking-tighter text-primary">
                ${order.totalAmount}
              </p>
            </div>
            <Button
              variant="outline"
              className="rounded-xl font-bold gap-2 w-full lg:w-auto px-6 h-12"
            >
              Track Parcel
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserOrders;
