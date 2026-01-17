import React, { useState, useMemo } from "react";
import DashboardLayout from "../Dashboard";
import {
  useGetOrdersQuery,
  useUpdateOrderMutation,
} from "@/redux/query/dashboardApi";
import {
  ShoppingBag,
  Search,
  MoreVertical,
  Eye,
  Loader2,
  Calendar,
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

const AdminOrders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: ordersData, isLoading, refetch } = useGetOrdersQuery(undefined);
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isViewOrderModalOpen, setIsViewOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [newStatus, setNewStatus] = useState("PENDING");

  const orders = ordersData || [];

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    try {
      await updateOrder({
        orderId: selectedOrder.id,
        status: newStatus,
      }).unwrap();
      toast.success("Global order status updated.");
      setIsUpdateModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update status.");
    }
  };

  const openStatusModal = (order: any) => {
    setSelectedOrder(order);
    setNewStatus(order.status || "PENDING");
    setIsUpdateModalOpen(true);
  };

  const openViewOrderModal = (order: any) => {
    setSelectedOrder(order);
    setIsViewOrderModalOpen(true);
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
    const variants: Record<string, string> = {
      PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      PROCESSING: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      SHIPPED: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      DELIVERED: "bg-green-500/10 text-green-500 border-green-500/20",
      CANCELLED: "bg-destructive/10 text-destructive border-destructive/20",
    };

    return (
      <Badge
        className={`rounded-lg border font-black italic tracking-widest text-[10px] ${
          variants[status] || "bg-secondary text-secondary-foreground"
        }`}
      >
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="h-[60vh] flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-black italic uppercase tracking-widest text-[10px]">
              <ShoppingBag className="w-3 h-3" /> Platform Logistics
            </div>
            <h1 className="text-5xl font-black italic tracking-tighter">
              Global <span className="text-primary text-6xl">Orders.</span>
            </h1>
            <p className="text-muted-foreground font-medium text-lg">
              Comprehensive control over all platform transactions.
            </p>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by ID, Name or Email..."
              className="h-14 pl-12 rounded-2xl bg-secondary/10 border-border/50 font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="rounded-[2.5rem] border border-border/50 bg-card/50 backdrop-blur-xl overflow-hidden shadow-2xl">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50 h-20">
                <TableHead className="w-[120px] pl-8 font-black uppercase tracking-widest text-[10px]">
                  Order ID
                </TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px]">
                  Buyer
                </TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px]">
                  Date
                </TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px]">
                  Revenue
                </TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px]">
                  Status
                </TableHead>
                <TableHead className="w-[100px] text-right pr-8 font-black uppercase tracking-widest text-[10px]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-40 text-center font-bold text-muted-foreground italic"
                  >
                    No trajectories found in system database.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order: any) => (
                  <TableRow
                    key={order.id}
                    className="group border-border/50 hover:bg-primary/2 transition-colors h-24"
                  >
                    <TableCell className="pl-8">
                      <code className="bg-secondary/20 px-2 py-1 rounded text-xs font-black italic">
                        #{order.id.slice(0, 8)}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary italic font-black">
                          {order.user?.username[0].toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black italic text-sm">
                            {order.user?.username}
                          </span>
                          <span className="text-[10px] font-bold opacity-60">
                            {order.user?.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="font-black italic text-base text-primary">
                      ${Number(order.totalPrice).toFixed(2)}
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
                            <MoreVertical className="w-5 h-5 text-muted-foreground" />
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
                            <Eye className="w-4 h-4" /> Inspect Trajectory
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="rounded-xl gap-3 font-bold cursor-pointer"
                            onClick={() => openStatusModal(order)}
                          >
                            <CheckCircle2 className="w-4 h-4" /> Override Status
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Global Status Override Modal */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="rounded-[2.5rem] max-w-md border-border/50 bg-background/95 backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black italic tracking-tighter">
              Status <span className="text-primary">Override.</span>
            </DialogTitle>
            <DialogDescription className="font-medium text-muted-foreground">
              Manual control for Order ID: {selectedOrder?.id.slice(0, 12)}...
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="p-6 rounded-4xl bg-secondary/10 border border-border/10 space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">
                Order Total
              </p>
              <h4 className="font-black italic text-3xl">
                ${Number(selectedOrder?.totalPrice).toFixed(2)}
              </h4>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">
                Global Status Designation
              </Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="h-14 rounded-2xl bg-secondary/10 border-border/20 font-bold">
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
              Override Global Pulse
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Full Order Intelligence Modal */}
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
              Complete platform context for this trajectory.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
            <div className="space-y-6">
              <div className="p-5 rounded-3xl bg-secondary/10 border border-border/10">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">
                  Buyer Credentials
                </p>
                <h4 className="font-black italic text-xl uppercase">
                  {selectedOrder?.user?.username}
                </h4>
                <p className="text-xs font-bold text-muted-foreground">
                  {selectedOrder?.user?.email}
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-secondary/10 border border-border/10">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">
                  Trajectory Target
                </p>
                <div className="text-sm font-bold space-y-0.5">
                  <p>{selectedOrder?.shippingAddress?.street}</p>
                  <p>
                    {selectedOrder?.shippingAddress?.city},{" "}
                    {selectedOrder?.shippingAddress?.state}{" "}
                    {selectedOrder?.shippingAddress?.zip}
                  </p>
                  <p className="text-[10px] uppercase opacity-50">
                    {selectedOrder?.shippingAddress?.country}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">
                Asset Manifest ({selectedOrder?.items?.length} items)
              </p>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {selectedOrder?.items?.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-secondary/5 border border-border/10 space-y-1"
                  >
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-black italic truncate max-w-[150px]">
                        {item.product?.title}
                      </p>
                      <span className="text-xs font-black text-primary">
                        ${Number(item.price).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-[9px] font-bold opacity-60 uppercase tracking-widest">
                      Qty: {item.quantity} | {item.variant?.color} /{" "}
                      {item.variant?.size}
                    </p>
                    <p className="text-[8px] font-mono opacity-40 uppercase">
                      SKU: {item.variant?.sku}
                    </p>
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
              Acknowledge Dataset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminOrders;
