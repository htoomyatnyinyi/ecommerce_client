import React from "react";
import DashboardLayout from "../Dashboard";
import { Link } from "react-router-dom";
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
import {
  useGetAdminStatsQuery,
  useGetDetailedAnalyticsQuery,
  useGetSystemConfigQuery,
  useUpdateSystemConfigMutation,
  useLazyGenerateReportQuery,
} from "@/redux/query/dashboardApi";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Settings,
  FileText,
  Download,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminDashboard: React.FC = () => {
  const { data: statsData, isLoading: statsLoading } =
    useGetAdminStatsQuery(undefined);
  const { data: analyticsData, isLoading: analyticsLoading } =
    useGetDetailedAnalyticsQuery(undefined);

  const { data: configData, refetch: refetchConfig } =
    useGetSystemConfigQuery(undefined);
  const [updateConfig, { isLoading: isUpdatingConfig }] =
    useUpdateSystemConfigMutation();
  const [triggerReport, { data: reportData, isFetching: isGeneratingReport }] =
    useLazyGenerateReportQuery();

  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const [configForm, setConfigForm] = useState({
    siteName: "OASIS",
    maintenanceMode: false,
    globalDiscount: "0",
    contactEmail: "",
  });

  useEffect(() => {
    if (configData?.data) {
      setConfigForm({
        siteName: configData.data.siteName || "OASIS",
        maintenanceMode: configData.data.maintenanceMode || false,
        globalDiscount: String(configData.data.globalDiscount || "0"),
        contactEmail: configData.data.contactEmail || "",
      });
    }
  }, [configData]);

  const handleUpdateConfig = async () => {
    try {
      await updateConfig({
        ...configForm,
        globalDiscount: parseFloat(configForm.globalDiscount),
      }).unwrap();
      toast.success("System configuration updated successfully!");
      setIsConfigOpen(false);
      refetchConfig();
    } catch (err) {
      toast.error("Failed to update configuration.");
    }
  };

  const handleGenerateReport = async () => {
    try {
      await triggerReport(undefined).unwrap();
      toast.success("Report generated successfully!");
    } catch (err) {
      toast.error("Failed to generate report.");
    }
  };

  const downloadReport = () => {
    if (!reportData?.report) return;
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(reportData.report, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute(
      "download",
      `oasis_report_${new Date().toISOString().split("T")[0]}.json`
    );
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

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
              className="rounded-2xl h-14 px-8 font-black gap-2 transition-all hover:bg-secondary/20"
              onClick={() => setIsReportOpen(true)}
            >
              <FileText className="w-5 h-5" />
              Generate Report
            </Button>
            <Button
              size="lg"
              className="rounded-2xl h-14 px-8 font-black gap-2 shadow-xl shadow-primary/20 transition-all hover:-translate-y-1"
              onClick={() => setIsConfigOpen(true)}
            >
              <Settings className="w-5 h-5" />
              System Config
            </Button>
          </div>
        </div>

        {/* ... (existing stats and cards) ... */}

        {/* System Config Modal */}
        <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
          <DialogContent className="rounded-[2.5rem] max-w-2xl border-border/50 bg-background/95 backdrop-blur-2xl">
            <DialogHeader>
              <DialogTitle className="text-3xl font-black italic tracking-tighter">
                System <span className="text-primary">Configuration.</span>
              </DialogTitle>
              <DialogDescription className="font-medium text-muted-foreground">
                Modify global OASIS parameters and platform behavior.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 text-left">
                  <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">
                    Platform Identity
                  </Label>
                  <Input
                    value={configForm.siteName}
                    onChange={(e) =>
                      setConfigForm({ ...configForm, siteName: e.target.value })
                    }
                    className="h-12 rounded-2xl bg-secondary/10 border-border/20 font-bold"
                    placeholder="Enter site name..."
                  />
                </div>
                <div className="space-y-2 text-left">
                  <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">
                    Universal Discount (%)
                  </Label>
                  <Input
                    type="number"
                    value={configForm.globalDiscount}
                    onChange={(e) =>
                      setConfigForm({
                        ...configForm,
                        globalDiscount: e.target.value,
                      })
                    }
                    className="h-12 rounded-2xl bg-secondary/10 border-border/20 font-bold"
                    placeholder="e.g. 15.00"
                  />
                </div>
              </div>
              <div className="space-y-2 text-left">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">
                  Admin Contact Vector
                </Label>
                <Input
                  value={configForm.contactEmail}
                  onChange={(e) =>
                    setConfigForm({
                      ...configForm,
                      contactEmail: e.target.value,
                    })
                  }
                  className="h-12 rounded-2xl bg-secondary/10 border-border/20 font-bold"
                  placeholder="admin@oasis.com"
                />
              </div>
              <div className="flex items-center justify-between p-6 rounded-3xl bg-primary/5 border border-primary/10 mt-2">
                <div className="space-y-0.5">
                  <Label className="text-sm font-black italic tracking-tight">
                    Maintenance Protocol
                  </Label>
                  <p className="text-xs text-muted-foreground font-medium">
                    Suspend public access for core-system updates.
                  </p>
                </div>
                <Switch
                  checked={configForm.maintenanceMode}
                  onCheckedChange={(val) =>
                    setConfigForm({ ...configForm, maintenanceMode: val })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleUpdateConfig}
                disabled={isUpdatingConfig}
                className="w-full h-14 rounded-2xl font-black italic text-lg shadow-xl shadow-primary/20"
              >
                {isUpdatingConfig ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Synchronize System Pulse"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Report Generation Modal */}
        <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
          <DialogContent className="rounded-[2.5rem] max-w-3xl border-border/50 bg-background/95 backdrop-blur-2xl">
            <DialogHeader>
              <DialogTitle className="text-3xl font-black italic tracking-tighter">
                Platform <span className="text-primary">Intelligence.</span>
              </DialogTitle>
              <DialogDescription className="font-medium text-muted-foreground">
                Generate comprehensive performance trajectory reports.
              </DialogDescription>
            </DialogHeader>
            <div className="py-8">
              {!reportData ? (
                <div className="flex flex-col items-center justify-center p-12 space-y-6 border-2 border-dashed border-border/50 rounded-4xl bg-secondary/5">
                  <div className="w-20 h-20 bg-primary/10 text-primary flex items-center justify-center rounded-3xl shrink-0">
                    <FileText className="w-10 h-10" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-black italic">
                      Ready to Compile.
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium max-w-[300px]">
                      Aggregate sales, user velocity, and inventory health into
                      a single dataset.
                    </p>
                  </div>
                  <Button
                    onClick={handleGenerateReport}
                    disabled={isGeneratingReport}
                    className="rounded-2xl px-10 h-14 font-black italic shadow-2xl shadow-primary/20"
                  >
                    {isGeneratingReport ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-3" />
                    ) : (
                      <BarChart3 className="w-5 h-5 mr-3" />
                    )}
                    Initiate Data Synthesis
                  </Button>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-5 rounded-3xl bg-secondary/10 border border-border/10 text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                        Revenue Delta
                      </p>
                      <h4 className="text-2xl font-black italic text-primary">
                        $
                        {Number(
                          reportData.report.summary.totalRevenue
                        ).toLocaleString()}
                      </h4>
                    </div>
                    <div className="p-5 rounded-3xl bg-secondary/10 border border-border/10 text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                        Growth Index
                      </p>
                      <h4 className="text-2xl font-black italic">
                        {reportData.report.summary.totalUsers}{" "}
                        <span className="text-xs uppercase ml-1">Users</span>
                      </h4>
                    </div>
                    <div className="p-5 rounded-3xl bg-secondary/10 border border-border/10 text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                        Supply Health
                      </p>
                      <h4
                        className={cn(
                          "text-2xl font-black italic",
                          reportData.report.inventoryHealth > 0
                            ? "text-amber-500"
                            : "text-green-500"
                        )}
                      >
                        {reportData.report.inventoryHealth}{" "}
                        <span className="text-xs uppercase ml-1">Alerts</span>
                      </h4>
                    </div>
                  </div>
                  <div className="p-8 rounded-4xl bg-primary/5 border border-primary/20 flex items-center gap-6">
                    <div className="w-16 h-16 bg-primary text-primary-foreground flex items-center justify-center rounded-3xl shrink-0">
                      <Download className="w-8 h-8" />
                    </div>
                    <div className="grow">
                      <h3 className="font-black italic text-xl">
                        Synthesis Complete.
                      </h3>
                      <p className="text-sm text-muted-foreground font-medium">
                        Dataset ready for global distribution (JSON format).
                      </p>
                    </div>
                    <Button
                      onClick={downloadReport}
                      className="rounded-2xl h-12 px-6 font-black italic gap-2"
                    >
                      Download Asset
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

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
          <Link
            to="/dashboard/orders"
            className="block transition-all hover:scale-[1.02]"
          >
            <AdminStatCard
              title="Total Orders"
              value={(stats?.totalOrders || 0).toLocaleString()}
              icon={<ShoppingBag />}
              trend="Active"
            />
          </Link>
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
