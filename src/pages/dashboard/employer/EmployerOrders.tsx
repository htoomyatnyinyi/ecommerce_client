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
  const [isViewOrderModalOpen, setIsViewOrderModalOpen] = useState(false);
  const [isShippingLabelModalOpen, setIsShippingLabelModalOpen] =
    useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedFullOrder, setSelectedFullOrder] = useState<any>(null);
  const [newStatus, setNewStatus] = useState("PENDING");
  const [trackingNumber, setTrackingNumber] = useState("");

  const orders = ordersData || [];

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

  const openViewOrderModal = (order: any) => {
    setSelectedFullOrder(order);
    setIsViewOrderModalOpen(true);
  };

  const openShippingLabelModal = (order: any) => {
    setSelectedFullOrder(order);
    setIsShippingLabelModalOpen(true);
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
                        <DropdownMenuItem
                          className="rounded-xl gap-3 font-bold cursor-pointer"
                          onClick={() => openViewOrderModal(order)}
                        >
                          <Eye className="w-4 h-4" /> View Full Order
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="rounded-xl gap-3 font-bold cursor-pointer"
                          onClick={() => openShippingLabelModal(order)}
                        >
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

      {/* View Full Order Modal */}
      <Dialog
        open={isViewOrderModalOpen}
        onOpenChange={setIsViewOrderModalOpen}
      >
        <DialogContent className="rounded-[2.5rem] max-w-2xl border-border/50 bg-background/95 backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black italic tracking-tighter">
              Order <span className="text-primary">Intelligence.</span>
            </DialogTitle>
            <DialogDescription className="font-medium text-muted-foreground">
              Comprehensive context for Order ID:{" "}
              {selectedFullOrder?.id.slice(0, 12)}...
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
            <div className="space-y-6">
              <div className="p-5 rounded-3xl bg-secondary/10 border border-border/10 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">
                  Buyer Credentials
                </p>
                <div className="space-y-1">
                  <h4 className="font-black italic text-xl uppercase">
                    {selectedFullOrder?.user?.username}
                  </h4>
                  <p className="text-xs font-bold text-muted-foreground">
                    {selectedFullOrder?.user?.email}
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-secondary/10 border border-border/10 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">
                  Trajectory Target
                </p>
                <div className="space-y-1 text-sm font-bold">
                  <p>{selectedFullOrder?.shippingAddress?.street}</p>
                  <p>
                    {selectedFullOrder?.shippingAddress?.city},{" "}
                    {selectedFullOrder?.shippingAddress?.state}{" "}
                    {selectedFullOrder?.shippingAddress?.zip}
                  </p>
                  <p className="text-muted-foreground uppercase text-[10px] mt-1">
                    {selectedFullOrder?.shippingAddress?.country}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">
                My Assets in This Order
              </p>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {selectedFullOrder?.items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-secondary/5 border border-border/10 flex justify-between items-center"
                  >
                    <div className="space-y-1">
                      <p className="text-xs font-black italic">
                        {item.productTitle}
                      </p>
                      <p className="text-[9px] font-bold opacity-60 uppercase tracking-widest">
                        Qty: {item.quantity} | {item.variantInfo}
                      </p>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => setIsViewOrderModalOpen(false)}
              className="w-full h-14 rounded-2xl font-black italic text-lg shadow-xl shadow-primary/20"
            >
              Acknowledge Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Shipping Label Modal */}
      <Dialog
        open={isShippingLabelModalOpen}
        onOpenChange={setIsShippingLabelModalOpen}
      >
        <DialogContent className="rounded-[2.5rem] max-w-2xl border-border/50 bg-background/95 backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black italic tracking-tighter">
              Logistics <span className="text-primary">Manifest.</span>
            </DialogTitle>
            <DialogDescription className="font-medium text-muted-foreground">
              Print-ready fulfillment documentation for this trajectory.
            </DialogDescription>
          </DialogHeader>

          <div className="py-8">
            <div className="bg-white text-black p-10 rounded-[2rem] border-4 border-black shadow-2xl relative overflow-hidden group">
              {/* Zebra stripes effect */}
              <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

              <div className="relative z-10 space-y-8">
                <div className="flex justify-between items-start border-b-4 border-black pb-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest">
                      Courier Class
                    </p>
                    <h2 className="text-4xl font-black italic tracking-tighter">
                      PRIORITY.
                    </h2>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest">
                      Manifest Code
                    </p>
                    <p className="font-mono font-bold text-sm">
                      #{selectedFullOrder?.id.slice(0, 12).toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-widest mb-1 opacity-60">
                        Ship From
                      </p>
                      <p className="font-black text-xs italic">
                        OASIS MERCHANT CENTER
                      </p>
                      <p className="text-[10px] font-bold">
                        Vector Hub Alpha-9
                      </p>
                      <p className="text-[10px] font-bold">
                        Nebula Logistics District
                      </p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-widest mb-1 opacity-60">
                        Fulfillment Assets
                      </p>
                      <div className="space-y-1">
                        {selectedFullOrder?.items.map(
                          (item: any, idx: number) => (
                            <p
                              key={idx}
                              className="text-[10px] font-bold truncate"
                            >
                              ● {item.productTitle} (x{item.quantity})
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 border-l-4 border-black pl-10">
                    <p className="text-[8px] font-black uppercase tracking-widest mb-1 opacity-60">
                      Deliver To
                    </p>
                    <div className="space-y-1">
                      <p className="font-black text-lg italic uppercase">
                        {selectedFullOrder?.user?.username}
                      </p>
                      <p className="font-bold text-sm leading-tight">
                        {selectedFullOrder?.shippingAddress?.street}
                        <br />
                        {selectedFullOrder?.shippingAddress?.city},{" "}
                        {selectedFullOrder?.shippingAddress?.state}{" "}
                        {selectedFullOrder?.shippingAddress?.zip}
                        <br />
                        <span className="uppercase text-xs">
                          {selectedFullOrder?.shippingAddress?.country}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t-4 border-black pt-8 space-y-4">
                  <div className="flex justify-between items-center font-black italic">
                    <span className="text-2xl tracking-tighter uppercase">
                      OASIS Fulfillment
                    </span>
                    <span className="text-sm uppercase tracking-widest bg-black text-white px-3 py-1 rounded-lg">
                      Sector 01
                    </span>
                  </div>
                  {/* Mock Barcode */}
                  <div className="h-24 bg-black w-full relative flex items-center justify-center overflow-hidden rounded-xl">
                    <div className="absolute inset-0 flex">
                      {Array.from({ length: 120 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-full bg-white"
                          style={{
                            width: `${Math.random() * 4 + 1}px`,
                            marginLeft: `${Math.random() * 2 + 1}px`,
                          }}
                        />
                      ))}
                    </div>
                    <p className="relative z-10 bg-white px-4 py-1 font-mono text-[10px] font-bold tracking-[0.5em] rounded-md">
                      {selectedFullOrder?.id.slice(0, 20).toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsShippingLabelModalOpen(false)}
              className="h-14 rounded-2xl font-black uppercase tracking-widest text-[10px]"
            >
              Cancel
            </Button>
            <Button
              onClick={() => window.print()}
              className="h-14 rounded-2xl font-black italic text-lg shadow-xl shadow-primary/20 gap-3"
            >
              Print Manifest
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default EmployerOrders;
