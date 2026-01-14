import React from "react";
import DashboardLayout from "../Dashboard";
import { useGetDetailedAnalyticsQuery } from "@/redux/query/dashboardApi";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  TrendingUp,
  AlertTriangle,
  Loader2,
  Package,
  Layers,
} from "lucide-react";

const AnalyticsDashboard: React.FC = () => {
  const { data, isLoading } = useGetDetailedAnalyticsQuery(undefined);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const categoryRevenue = data?.categoryRevenue || [];
  const inventoryHealth = data?.inventoryHealth || [];

  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-5xl font-black italic tracking-tighter mb-2">
            Global <span className="text-primary text-6xl">Intelligence.</span>
          </h1>
          <p className="text-muted-foreground text-lg font-medium">
            Proprietary analytics and ecosystem growth trajectory.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue by Category Visual */}
          <Card className="rounded-[2.5rem] border-border/50 bg-secondary/10 overflow-hidden">
            <CardHeader className="p-8">
              <div className="flex justify-between items-center text-primary mb-4">
                <Layers className="w-10 h-10 opacity-20" />
                <TrendingUp className="w-6 h-6" />
              </div>
              <CardTitle className="text-2xl font-black italic">
                Revenue Distribution
              </CardTitle>
              <CardDescription>
                Performance across product sectors.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
              {categoryRevenue.map((cat: any, i: number) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="uppercase tracking-widest">
                      {cat.name}
                    </span>
                    <span>${Number(cat.revenue).toLocaleString()}</span>
                  </div>
                  <div className="h-4 bg-background/50 rounded-full overflow-hidden border border-border/10">
                    <div
                      className="h-full bg-primary transition-all duration-1000"
                      style={{
                        width: `${Math.min(
                          100,
                          (cat.revenue /
                            Math.max(
                              ...categoryRevenue.map((c: any) => c.revenue),
                              1
                            )) *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
              {categoryRevenue.length === 0 && (
                <p className="text-center text-muted-foreground italic py-10">
                  No revenue data available yet.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Inventory Health / Alerts */}
          <Card className="rounded-[2.5rem] border-border/50 bg-card overflow-hidden">
            <CardHeader className="p-8">
              <div className="flex justify-between items-center text-yellow-500 mb-4">
                <Package className="w-10 h-10 opacity-20" />
                <AlertTriangle className="w-6 h-6" />
              </div>
              <CardTitle className="text-2xl font-black italic">
                Supply Chain Status
              </CardTitle>
              <CardDescription>
                Critical stock alerts and inventory health.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-4">
              {inventoryHealth.length > 0 ? (
                inventoryHealth.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-6 p-4 rounded-2xl bg-secondary/10 border border-border/10 group hover:border-yellow-500/50 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/10 text-yellow-600 flex items-center justify-center shrink-0 font-black italic">
                      {item.stock}
                    </div>
                    <div className="grow">
                      <h4 className="font-bold text-sm leading-tight">
                        {item.product?.title}
                      </h4>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        SKU: {item.sku}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-yellow-600">
                        Low Stock
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <p className="text-muted-foreground font-bold italic">
                    All inventory levels are nominal.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsDashboard;
