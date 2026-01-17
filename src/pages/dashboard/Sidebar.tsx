import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthMeQuery } from "@/redux/query/authApi";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  Settings,
  ChevronRight,
  PlusCircle,
  History,
  Store,
  BarChart3,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const Sidebar: React.FC = () => {
  const { data: user } = useAuthMeQuery();
  const location = useLocation();

  const role = user?.role || "USER";

  const menuItems = {
    USER: [
      { path: "/user/dashboard", label: "My Overview", icon: LayoutDashboard },
      { path: "/user/orders", label: "Order History", icon: History },
      { path: "/user/profile", label: "Profile Settings", icon: Settings },
    ],
    EMPLOYER: [
      { path: "/employer/dashboard", label: "Store Overview", icon: BarChart3 },
      { path: "/employer/products", label: "My Products", icon: Package },
      {
        path: "/employer/products/manage/new",
        label: "Add Product",
        icon: PlusCircle,
      },
      { path: "/employer/orders", label: "Manage Orders", icon: ShoppingBag },
    ],
    ADMIN: [
      { path: "/dashboard", label: "Admin Console", icon: LayoutDashboard },
      { path: "/dashboard/products", label: "Global Inventory", icon: Package },
      {
        path: "/dashboard/products/manage/new",
        label: "Add Product",
        icon: PlusCircle,
      },
      { path: "/dashboard/users", label: "User Accounts", icon: Users },
      {
        path: "/dashboard/orders",
        label: "Platform Orders",
        icon: ShoppingBag,
      },
      { path: "/dashboard/analytics", label: "Global Stats", icon: BarChart3 },
    ],
  };

  const currentMenu =
    menuItems[role as keyof typeof menuItems] || menuItems.USER;

  return (
    <>
      {/* <aside className="hidden md:block sm:w-0 md:w-20 lg:w-80 h-screen sticky top-0 bg-card border-r border-border/50 flex flex-col pt-24 pb-12 transition-all duration-500"> */}

      {/* Desktop Sidebar */}
      {/* Desktop/Tablet Sidebar */}
      <aside className="hidden md:flex md:w-24 lg:w-80 h-screen sticky top-0 bg-card border-r border-border/50 flex-col pt-24 pb-12 transition-all duration-500">
        <div className="px-3 lg:px-6 mb-8">
          {/* Full Card for Large Screens */}
          <div className="hidden lg:block bg-secondary/20 rounded-3xl p-6 border border-border/50 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-700" />
            <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">
              Authenticated as
            </p>
            <h3 className="text-xl font-black italic tracking-tighter text-foreground truncate">
              {user?.username || "Guest"}
            </h3>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
              {role === "ADMIN" ? (
                <ShieldCheck className="w-3 h-3" />
              ) : role === "EMPLOYER" ? (
                <Store className="w-3 h-3" />
              ) : (
                <User className="w-3 h-3" />
              )}
              {role}
            </div>
          </div>

          {/* Compact Icon for Tablet Screens */}
          <div className="lg:hidden flex justify-center">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-lg shadow-primary/10">
              {role === "ADMIN" ? (
                <ShieldCheck className="w-6 h-6" />
              ) : role === "EMPLOYER" ? (
                <Store className="w-6 h-6" />
              ) : (
                <User className="w-6 h-6" />
              )}
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 lg:px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {currentMenu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "group flex items-center justify-center lg:justify-between p-3 lg:p-4 rounded-2xl transition-all duration-300 relative overflow-hidden",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-0 lg:gap-4 z-10">
                  <item.icon
                    className={cn(
                      "w-6 h-6 lg:w-5 lg:h-5",
                      isActive
                        ? "animate-pulse"
                        : "group-hover:scale-110 transition-transform"
                    )}
                  />
                  <span className="hidden lg:block font-bold text-sm">
                    {item.label}
                  </span>
                </div>
                <ChevronRight
                  className={cn(
                    "hidden lg:block w-4 h-4 transition-all duration-300",
                    isActive
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                  )}
                />
                {isActive && (
                  <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/5 to-white/10" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-6 mt-6 hidden lg:block">
          <div className="p-6 rounded-3xl bg-secondary/10 border border-border/30 text-center">
            <p className="text-xs text-muted-foreground font-medium mb-1 truncate">
              Running oasis v2.0
            </p>
            <p className="text-xs font-bold text-muted-foreground/50">
              Htoo Myat Nyi Nyi
            </p>
            <div className="flex justify-center gap-2 mt-3 grayscale opacity-50">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-75" />
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse delay-150" />
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Floating Trigger */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="h-14 w-14 rounded-full shadow-2xl shadow-primary/30 bg-primary text-primary-foreground hover:scale-105 transition-transform"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[300px] p-0 border-r border-border/50 bg-card/95 backdrop-blur-xl"
          >
            <div className="flex flex-col h-full pt-12 pb-8">
              <div className="px-6 mb-8">
                <div className="bg-secondary/20 rounded-3xl p-6 border border-border/50 relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">
                    Menu
                  </p>
                  <h3 className="text-xl font-black italic tracking-tighter text-foreground truncate">
                    {user?.username || "Guest"}
                  </h3>
                </div>
              </div>

              <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                {currentMenu.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "group flex items-center justify-between p-4 rounded-2xl transition-all duration-300 relative overflow-hidden",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                          : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-4 z-10">
                        <item.icon
                          className={cn(
                            "w-5 h-5",
                            isActive
                              ? "animate-pulse"
                              : "group-hover:scale-110 transition-transform"
                          )}
                        />
                        <span className="font-bold text-sm">{item.label}</span>
                      </div>
                      <ChevronRight
                        className={cn(
                          "w-4 h-4 transition-all duration-300",
                          isActive
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                        )}
                      />
                      {isActive && (
                        <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/5 to-white/10" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              <div className="px-6 mt-6">
                <p className="text-center text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest">
                  Oasis Mobile v2.0
                </p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

// Simple icon fallbacks for the local scope if imports fail
const ShieldCheck = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
const User = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default Sidebar;
