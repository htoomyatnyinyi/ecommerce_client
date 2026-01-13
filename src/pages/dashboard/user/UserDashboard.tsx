import React from "react";
import DashboardLayout from "../Dashboard";
import {
  ShoppingBag,
  Heart,
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

const UserDashboard: React.FC = () => {
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
              Manage your orders, wishlist, and account preferences.
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
            count="3 Active"
            icon={<Box className="w-8 h-8" />}
            color="bg-blue-500/10 text-blue-500"
            link="/user/orders"
          />
          <ActionWidget
            title="Wishlist"
            desc="Saved items you love"
            count="12 Items"
            icon={<Heart className="w-8 h-8" />}
            color="bg-red-500/10 text-red-500"
            link="/user/wishlist"
          />
          <ActionWidget
            title="Payment Methods"
            desc="Manage your secure cards"
            count="2 Saved"
            icon={<CreditCard className="w-8 h-8" />}
            color="bg-purple-500/10 text-purple-500"
            link="/user/payments"
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
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="bg-background/50 rounded-2xl p-6 border border-border/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-xl bg-muted overflow-hidden">
                        <img
                          src={`https://picsum.photos/seed/${i + 100}/200`}
                          alt="order"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-lg">
                          Order #OX-{8542 + i}
                        </h4>
                        <p className="text-sm text-muted-foreground font-medium mb-1">
                          2 Items • Delivered yesterday
                        </p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-green-500/10 text-green-500 uppercase tracking-widest border border-green-500/20">
                          Delivered
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="rounded-xl font-bold gap-2"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
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
              <div className="p-6 rounded-2xl bg-background/50 border border-primary/20">
                <p className="font-black text-primary text-sm uppercase tracking-widest mb-2">
                  Default Address
                </p>
                <p className="font-bold">Home (John Doe)</p>
                <p className="text-muted-foreground font-semibold">
                  123 Designer Street, Fashion District
                </p>
                <p className="text-muted-foreground font-semibold">
                  New York, NY 10001, United States
                </p>
              </div>
              <Button
                variant="link"
                className="p-0 text-primary font-black hover:underline underline-offset-4 decoration-2"
              >
                Manage Addresses
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
