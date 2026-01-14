import React from "react";
import DashboardLayout from "../Dashboard";
import {
  ShoppingBag,
  // Heart,
  CreditCard,
  Box,
  MapPin,
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
import { Link } from "react-router-dom";

import {
  useGetOrdersQuery,
  useGetOrderStatsQuery,
} from "@/redux/query/orderApi";
import { useGetAddressesQuery } from "@/redux/query/userApi";
import { useAuthMeQuery } from "@/redux/query/authApi";

const UserDashboard: React.FC = () => {
  const { data: user } = useAuthMeQuery();
  const { data: orders, isLoading: isOrdersLoading } = useGetOrdersQuery();
  const { data: statsData } = useGetOrderStatsQuery();
  const { data: addresses } = useGetAddressesQuery();

  const stats = statsData?.stats || {
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    completedOrders: 0,
  };
  const defaultAddress =
    addresses?.find((a: any) => a.isDefault) || addresses?.[0];

  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-5xl font-black italic tracking-tighter mb-2">
              Personal <span className="text-primary">Oasis.</span>
            </h1>
            <p className="text-muted-foreground text-lg font-medium">
              Welcome back, {user?.username}. Manage your oasis here.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="rounded-2xl h-14 px-8 font-black gap-2 shadow-xl shadow-primary/20"
          >
            <Link to="/products">
              <ShoppingBag className="w-5 h-5" />
              Explore Products
            </Link>
          </Button>
        </div>

        {/* Action Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActionWidget
            title="My Orders"
            desc="Track and manage your purchases"
            count={`${stats.totalOrders} Total`}
            icon={<Box className="w-8 h-8" />}
            color="bg-blue-500/10 text-blue-500"
            link="/user/orders"
          />
          <ActionWidget
            title="Account"
            desc="Update profile and security"
            count="Settings"
            icon={<CreditCard className="w-8 h-8" />}
            color="bg-purple-500/10 text-purple-500"
            link="/user/profile"
          />
          <ActionWidget
            title="Wallet"
            desc="Your total store spending"
            count={`$${stats.totalSpent}`}
            icon={<ShoppingBag className="w-8 h-8" />}
            color="bg-green-500/10 text-green-500"
            link="/user/orders"
          />
        </div>

        {/* main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <Card className="lg:col-span-2 rounded-[2.5rem] border-border/50 bg-secondary/10 overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-2xl font-black italic">
                Recent Orders
              </CardTitle>
              <CardDescription>
                Keep track of your latest deliveries.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <div className="space-y-4">
                {isOrdersLoading ? (
                  <div className="h-20 bg-secondary/20 animate-pulse rounded-2xl" />
                ) : orders && orders.length > 0 ? (
                  orders.slice(0, 3).map((order: any) => (
                    <div
                      key={order.id}
                      className="bg-background/50 rounded-2xl p-6 border border-border/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden">
                          <img
                            src={
                              order.items?.[0]?.product?.images?.[0]?.url ||
                              `https://picsum.photos/seed/${order.id}/200`
                            }
                            alt="order"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-lg">
                            Order #{order.id.slice(-8).toUpperCase()}
                          </h4>
                          <p className="text-sm text-muted-foreground font-medium mb-1">
                            {order.items?.length} Items • ${order.totalPrice}
                          </p>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black bg-primary/10 text-primary uppercase tracking-widest border border-primary/20">
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <Button
                        asChild
                        variant="outline"
                        className="rounded-xl font-bold gap-2"
                      >
                        <Link to="/user/orders">
                          View
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center border-2 border-dashed border-border/50 rounded-[2.5rem]">
                    <p className="font-bold text-muted-foreground">
                      No orders yet.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Profile Summary / Address */}
          <Card className="rounded-[2.5rem] border-primary/20 bg-primary/5 h-fit overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <MapPin className="w-24 h-24 text-primary" />
            </div>
            <CardHeader className="p-8">
              <CardTitle className="text-2xl font-black italic">
                Shipping Info
              </CardTitle>
              <CardDescription>Primary delivery destination.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
              {defaultAddress ? (
                <div className="p-6 rounded-2xl bg-background/50 border border-primary/20">
                  <p className="font-black text-primary text-sm uppercase tracking-widest mb-2">
                    {defaultAddress.isDefault
                      ? "Default Address"
                      : "Primary Address"}
                  </p>
                  <p className="font-bold">{defaultAddress.street}</p>
                  <p className="text-muted-foreground font-semibold">
                    {defaultAddress.city}, {defaultAddress.state}
                  </p>
                  <p className="text-muted-foreground font-semibold">
                    {defaultAddress.postalCode}, {defaultAddress.country}
                  </p>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-background/50 border border-dashed border-primary/20 text-center">
                  <p className="text-sm font-bold opacity-50">
                    No address saved.
                  </p>
                </div>
              )}
              <Button
                asChild
                variant="link"
                className="p-0 text-primary font-black hover:underline underline-offset-4 decoration-2"
              >
                <Link to="/user/profile">Manage Addresses</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

interface ActionWidgetProps {
  title: string;
  desc: string;
  count: string;
  icon: React.ReactNode;
  color: string;
  link: string;
}

const ActionWidget = ({
  title,
  desc,
  count,
  icon,
  color,
  link,
}: ActionWidgetProps) => (
  <Link to={link}>
    <Card className="rounded-3xl border-border/50 bg-card hover:border-primary/50 transition-all group overflow-hidden h-full">
      <CardContent className="p-8">
        <div
          className={cn(
            "p-4 rounded-2xl w-fit mb-6 transition-transform group-hover:scale-110 duration-500",
            color
          )}
        >
          {icon}
        </div>
        <h3 className="text-2xl font-black italic tracking-tighter mb-1">
          {title}
        </h3>
        <p className="text-muted-foreground font-medium text-sm mb-4">{desc}</p>
        <div className="flex justify-between items-end">
          <span className="text-xs font-black uppercase tracking-widest opacity-60">
            {count}
          </span>
          <div className="h-2 w-12 bg-primary/20 rounded-full group-hover:w-20 transition-all duration-500" />
        </div>
      </CardContent>
    </Card>
  </Link>
);

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

export default UserDashboard;
