import React, { useState, useMemo } from "react";
import DashboardLayout from "../Dashboard";
import {
  useGetEmployerOrdersQuery,
  useUpdateOrderItemStatusMutation,
} from "@/redux/query/dashboardApi";
import {
  ShoppingBag,
  Search,
  MoreVertical,
  Eye,
  Loader2,
  ArrowUpDown,
  User,
  MapPin,
  Calendar,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const EmployerOrders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: ordersData,
    isLoading,
    refetch,
  } = useGetEmployerOrdersQuery(undefined);
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateOrderItemStatusMutation();

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [newStatus, setNewStatus] = useState("PENDING");
  const [trackingNumber, setTrackingNumber] = useState("");

  const orders = ordersData?.orders || [];

  const handleUpdateStatus = async () => {
    if (!selectedItem) return;
    try {
      await updateStatus({
        orderItemId: selectedItem.id,
        status: newStatus,
        trackingNumber,
      }).unwrap();
      toast.success("Order item status synchronized.");
      setIsUpdateModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to sync status.");
    }
  };

  const openStatusModal = (item: any) => {
    setSelectedItem(item);
    setNewStatus(item.status || "PENDING");
    setTrackingNumber(item.trackingNumber || "");
    setIsUpdateModalOpen(true);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order: any) => {
      const buyerMatch =
        order.user?.username
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const idMatch = order.id.toLowerCase().includes(searchTerm.toLowerCase());
      return buyerMatch || idMatch;
    });
  }, [orders, searchTerm]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return (
          <Badge className="bg-green-500/10 text-green-500 border-green-500/20 font-black italic uppercase text-[8px]">
            Delivered
          </Badge>
        );
      case "SHIPPED":
        return (
          <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 font-black italic uppercase text-[8px]">
            Shipped
          </Badge>
        );
      case "PROCESSING":
        return (
          <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-black italic uppercase text-[8px]">
            Processing
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge className="bg-red-500/10 text-red-500 border-red-500/20 font-black italic uppercase text-[8px]">
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="font-black italic uppercase text-[8px]"
          >
            {status}
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-5xl font-black italic tracking-tighter mb-2">
              Order <span className="text-primary">Fulfillment.</span>
            </h1>
            <p className="text-muted-foreground text-lg font-medium">
              Track multi-vendor orders containing your assets.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center bg-card/50 backdrop-blur-xl p-4 rounded-3xl border border-border/50">
          <div className="relative grow w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by Order ID, Buyer Name or Email..."
              className="h-12 pl-12 rounded-2xl bg-secondary/10 border-border/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="h-12 rounded-2xl gap-2 font-bold px-6"
          >
            <ArrowUpDown className="w-4 h-4" /> Sort
          </Button>
        </div>

        {/* Orders Table */}
        <div className="rounded-4xl bg-card/50 backdrop-blur-xl border border-border/50 overflow-hidden shadow-2xl">
          <Table>
            <TableHeader className="bg-secondary/20">
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="font-black italic uppercase tracking-widest text-[10px] py-6 pl-8">
                  Order Details
                </TableHead>
                <TableHead className="font-black italic uppercase tracking-widest text-[10px]">
                  Buyer Information
                </TableHead>
                <TableHead className="font-black italic uppercase tracking-widest text-[10px]">
                  My Items
                </TableHead>
                <TableHead className="font-black italic uppercase tracking-widest text-[10px]">
                  Order Status
                </TableHead>
                <TableHead className="font-black italic uppercase tracking-widest text-[10px] text-right pr-8">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order: any) => (
                <TableRow
                  key={order.id}
                  className="border-border/20 hover:bg-primary/5 transition-colors group"
                >
                  <TableCell className="py-6 pl-8">
                    <div className="space-y-1">
                      <p className="font-black italic text-sm tracking-tight">
                        ID: {order.id.slice(0, 8)}...
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        <Calendar className="w-3 h-3" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <User className="w-3.5 h-3.5 text-primary" />
                        {order.user?.username}
                      </div>
                      <p className="text-[10px] text-muted-foreground font-medium">
                        {order.user?.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-4">
                      {order.items.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-start justify-between gap-4 p-3 rounded-2xl bg-secondary/5 border border-border/10"
                        >
                          <div className="flex flex-col">
                            <span className="text-xs font-black italic">
                              {item.productTitle}
                            </span>
                            <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">
                              Qty: {item.quantity} | {item.variantInfo}
                            </span>
                            {item.trackingNumber && (
                              <span className="text-[10px] font-black text-primary uppercase tracking-tighter mt-1">
                                Trk: {item.trackingNumber}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {getStatusBadge(item.status)}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-all"
                              onClick={() => openStatusModal(item)}
                            >
                              Sync Status
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-right pr-8">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-xl"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="rounded-2xl border-border/50 p-2 bg-background/95 backdrop-blur-md"
                      >
                        <DropdownMenuItem className="rounded-xl gap-3 font-bold cursor-pointer">
                          <Eye className="w-4 h-4" /> View Full Order
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl gap-3 font-bold cursor-pointer">
                          <MapPin className="w-4 h-4" /> Shipping Label
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredOrders.length === 0 && (
            <div className="p-20 text-center space-y-4">
              <ShoppingBag className="w-20 h-20 text-muted-foreground/20 mx-auto" />
              <p className="text-xl font-black italic text-muted-foreground">
                No orders found containing your assets.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Item Status Update Modal */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="rounded-[2.5rem] max-w-lg border-border/50 bg-background/95 backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black italic tracking-tighter">
              Fulfillment <span className="text-primary">Sync.</span>
            </DialogTitle>
            <DialogDescription className="font-medium text-muted-foreground">
              Update the delivery trajectory for this specific asset.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6 text-left">
            <div className="p-4 rounded-3xl bg-secondary/10 border border-border/10">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">
                Target Asset
              </p>
              <h4 className="font-black italic text-lg">
                {selectedItem?.productTitle}
              </h4>
              <p className="text-xs font-bold text-muted-foreground">
                {selectedItem?.variantInfo}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">
                Fulfillment Status
              </Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="h-12 rounded-2xl bg-secondary/10 border-border/20 font-bold">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {[
                    "PENDING",
                    "PROCESSING",
                    "SHIPPED",
                    "DELIVERED",
                    "CANCELLED",
                  ].map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                      className="font-bold"
                    >
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">
                Tracking Designation
              </Label>
              <div className="relative">
                <Truck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Carrier reference code..."
                  className="h-12 pl-12 rounded-2xl bg-secondary/10 border-border/20 font-bold"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleUpdateStatus}
              disabled={isUpdating}
              className="w-full h-14 rounded-2xl font-black italic text-lg shadow-xl shadow-primary/20 gap-3"
            >
              {isUpdating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
              Synchronize Trajectory
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default EmployerOrders;
