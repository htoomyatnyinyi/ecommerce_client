import React from "react";
import DashboardLayout from "../Dashboard";
import {
  Users,
  ShoppingBag,
  BarChart3,
  ShieldAlert,
  Globe,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  useGetAdminStatsQuery,
  useGetDetailedAnalyticsQuery,
} from "@/redux/query/dashboardApi";

const AdminDashboard: React.FC = () => {
  const { data: statsData, isLoading: statsLoading } =
    useGetAdminStatsQuery(undefined);
  const { data: analyticsData, isLoading: analyticsLoading } =
    useGetDetailedAnalyticsQuery(undefined);

  if (statsLoading || analyticsLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const stats = statsData?.stats;
  const activities = statsData?.recentActivities;
  const monthlyStats = analyticsData?.monthlyStats || [];

  // Merge and sort activities
  const pulseEvents = [
    ...(activities?.users?.map((u: any) => ({
      event: "New User Registered",
      user: u.username,
      time: new Date(u.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      icon: <Users className="w-4 h-4" />,
      date: new Date(u.createdAt),
    })) || []),
    ...(activities?.orders?.map((o: any) => ({
      event: "New Order Placed",
      user: `${o.user?.username || "Guest"} — $${Number(o.totalPrice).toFixed(
        2
      )}`,
      time: new Date(o.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      icon: <ShoppingBag className="w-4 h-4" />,
      date: new Date(o.createdAt),
    })) || []),
  ]
    .sort((a: any, b: any) => b.date - a.date)
    .slice(0, 5);

  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-5xl font-black italic tracking-tighter mb-2">
              Admin <span className="text-primary">Terminal.</span>
            </h1>
            <p className="text-muted-foreground text-lg font-medium">
              Global platform control and ecosystem analytics.
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="lg"
              className="rounded-2xl h-14 px-8 font-black gap-2"
            >
              Generate Report
            </Button>
            <Button
              size="lg"
              className="rounded-2xl h-14 px-8 font-black gap-2 shadow-xl shadow-primary/20"
            >
              System Config
            </Button>
          </div>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AdminStatCard
            title="Global Revenue"
            value={`$${(stats?.globalRevenue || 0).toLocaleString()}`}
            icon={<Globe />}
            trend="Live"
            active
          />
          <AdminStatCard
            title="Total Users"
            value={(stats?.totalUsers || 0).toLocaleString()}
            icon={<Users />}
            trend={`Rank #${stats?.totalUsers}`}
          />
          <AdminStatCard
            title="Total Orders"
            value={(stats?.totalOrders || 0).toLocaleString()}
            icon={<ShoppingBag />}
            trend="Active"
          />
          <AdminStatCard
            title="Active Listings"
            value={(stats?.totalProducts || 0).toLocaleString()}
            icon={<ShieldAlert />}
            trend={`${stats?.lowStockCount || 0} Low Stock`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent System Activities */}
          <Card className="rounded-[2.5rem] border-border/50 bg-secondary/10 overflow-hidden">
            <CardHeader className="p-8">
              <CardTitle className="text-2xl font-black italic">
                Platform Pulse
              </CardTitle>
              <CardDescription>Real-time ecosystem events.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-4">
              {pulseEvents.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-6 p-5 rounded-2xl bg-background/50 border border-border/10 group hover:border-primary/50 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div className="grow">
                    <h4 className="font-bold">{item.event}</h4>
                    <p className="text-sm text-muted-foreground font-medium">
                      {item.user}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Global Sales Chart */}
          <Card className="rounded-[2.5rem] border-border/50 bg-card">
            <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-black italic">
                  Sales Performance
                </CardTitle>
                <CardDescription>
                  Growth trajectory over 6 months.
                </CardDescription>
              </div>
              <BarChart3 className="text-primary opacity-20 w-12 h-12" />
            </CardHeader>
            <CardContent className="p-8 flex flex-col items-center justify-center h-full min-h-[300px]">
              <div className="flex gap-4 items-end h-40 w-full justify-between px-4">
                {monthlyStats.map((item: any, i: number) => {
                  const maxRevenue = Math.max(
                    ...monthlyStats.map((s: any) => s.revenue),
                    1
                  );
                  const h = Math.max(10, (item.revenue / maxRevenue) * 100);
                  return (
                    <div
                      key={i}
                      className="w-full max-w-[15px] bg-primary/20 rounded-t-lg relative group overflow-hidden"
                      style={{ height: `${h}%` }}
                    >
                      <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full bg-primary text-white text-[8px] font-black p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        ${Math.round(item.revenue)}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="w-full flex justify-between mt-4 px-2 text-[10px] font-black italic uppercase tracking-widest text-muted-foreground opacity-50">
                {monthlyStats.map((item: any, i: number) => (
                  <span key={i}>{item.month}</span>
                ))}
              </div>
              <Button
                variant="ghost"
                className="mt-8 font-black gap-2 w-full border border-border/20 py-6 rounded-2xl"
              >
                Detailed Analytics Suite <ArrowUpRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

interface AdminStatCardProps {
  title: string;
  value: string;
  icon: React.ReactElement;
  trend: string;
  active?: boolean;
}

const AdminStatCard = ({
  title,
  value,
  icon,
  trend,
  active,
}: AdminStatCardProps) => (
  <Card
    className={cn(
      "rounded-3xl border-border/50 transition-all hover:scale-[1.02] duration-300",
      active
        ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/20"
        : "bg-card"
    )}
  >
    <CardContent className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div
          className={cn(
            "p-3 rounded-2xl",
            active ? "bg-white/20" : "bg-secondary/20 text-primary"
          )}
        >
          {React.cloneElement(icon, { className: "w-6 h-6" } as any)}
        </div>
        <span
          className={cn(
            "text-[10px] font-black uppercase tracking-widest",
            active ? "text-white/60" : "text-muted-foreground"
          )}
        >
          {trend}
        </span>
      </div>
      <p
        className={cn(
          "text-xs font-black uppercase tracking-widest mb-1",
          active ? "text-white/60" : "text-muted-foreground"
        )}
      >
        {title}
      </p>
      <h3 className="text-3xl font-black italic tracking-tighter">{value}</h3>
    </CardContent>
  </Card>
);

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

export default AdminDashboard;
