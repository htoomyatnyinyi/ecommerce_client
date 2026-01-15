import React from "react";
import DashboardLayout from "../Dashboard";
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  PlusCircle,
  ArrowUpRight,
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
import { useGetEmployerStatsQuery } from "@/redux/query/dashboardApi";
import { Loader2 } from "lucide-react";

const EmployerDashboard: React.FC = () => {
  const { data, isLoading } = useGetEmployerStatsQuery(undefined);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const stats = data?.stats;
  const recentListings = data?.recentListings || [];

  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-5xl font-black italic tracking-tighter mb-2">
              Merchant <span className="text-primary">Console.</span>
            </h1>
            <p className="text-muted-foreground text-lg font-medium">
              Manage your inventory, track sales, and grow your brand.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="rounded-2xl h-14 px-8 font-black gap-2 shadow-xl shadow-primary/20"
          >
            <Link to="/employer/products/manage/new">
              <PlusCircle className="w-5 h-5" />
              Add New Product
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={`$${(stats?.totalRevenue || 0).toLocaleString()}`}
            icon={<DollarSign />}
            trend="+12.5%"
          />
          <Link to="/employer/orders">
            <StatCard
              title="Total Orders"
              value={(stats?.totalOrders || 0).toLocaleString()}
              icon={<ShoppingCart />}
              trend="+8.2%"
            />
          </Link>
          <Link to="/employer/products">
            <StatCard
              title="Active Listings"
              value={(stats?.activeListings || 0).toLocaleString()}
              icon={<Package />}
              trend="+2 new"
            />
          </Link>
          <StatCard
            title="Sales Velocity"
            value={`${stats?.salesVelocity || "0"}/day`}
            icon={<TrendingUp />}
            trend="+15%"
          />
        </div>

        {/* main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Products */}
          <Card className="lg:col-span-2 rounded-[2.5rem] border-border/50 bg-secondary/10 overflow-hidden">
            <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-black italic">
                  Recent Listings
                </CardTitle>
                <CardDescription>
                  Your most recently updated product variants.
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                className="font-bold underline decoration-2 underline-offset-4"
                asChild
              >
                <Link to="/employer/products">View All</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <div className="space-y-4">
                {recentListings.map((product: any) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-6 p-4 rounded-2xl bg-background/50 border border-border/10 group hover:border-primary/30 transition-all cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden shrink-0">
                      <img
                        src={
                          product.images?.[0]?.url ||
                          `https://picsum.photos/seed/${product.id}/200`
                        }
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="grow">
                      <h4 className="font-bold text-lg">{product.title}</h4>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-xl">
                        ${Number(product.variants?.[0]?.price || 0).toFixed(2)}
                      </p>
                      <p className="text-xs text-green-500 font-bold">
                        {product.variants?.[0]?.stock || 0} In Stock
                      </p>
                    </div>
                    <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions / Store Health */}
          <Card className="rounded-[2.5rem] border-primary/20 bg-primary/5 h-fit">
            <CardHeader className="p-8">
              <CardTitle className="text-2xl font-black italic">
                Store Health
              </CardTitle>
              <CardDescription>
                Performance metrics for this month.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span>Order Fulfillment</span>
                  <span>94%</span>
                </div>
                <div className="h-2 bg-secondary/30 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[94%]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span>Customer Rating</span>
                  <span>4.8/5</span>
                </div>
                <div className="h-2 bg-secondary/30 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 w-[85%]" />
                </div>
              </div>
              <Separator className="bg-primary/10" />
              <div className="pt-2">
                <h5 className="font-black text-sm uppercase tracking-widest mb-4">
                  Quick Insights
                </h5>
                <ul className="space-y-3">
                  <li className="text-sm font-medium flex items-start gap-2 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    Your "Summer Tee" is trending. Consider adding more stock.
                  </li>
                  <li className="text-sm font-medium flex items-start gap-2 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    3 orders are pending shipment for more than 24 hours.
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactElement;
  trend: string;
}

const StatCard = ({ title, value, icon, trend }: StatCardProps) => (
  <Card className="rounded-3xl border-border/50 bg-card hover:border-primary/30 transition-all hover:-translate-y-1 duration-300">
    <CardContent className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-2xl bg-secondary/20 text-primary">
          {React.cloneElement(icon, { className: "w-6 h-6" } as any)}
        </div>
        <span
          className={cn(
            "px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
            trend.startsWith("+")
              ? "bg-green-500/10 text-green-500"
              : "bg-red-500/10 text-red-500"
          )}
        >
          {trend}
        </span>
      </div>
      <p className="text-muted-foreground text-xs font-black uppercase tracking-widest mb-1">
        {title}
      </p>
      <h3 className="text-3xl font-black tracking-tighter italic">{value}</h3>
    </CardContent>
  </Card>
);

const Separator = ({ className }: { className?: string }) => (
  <div className={cn("h-px w-full bg-border", className)} />
);

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

export default EmployerDashboard;
