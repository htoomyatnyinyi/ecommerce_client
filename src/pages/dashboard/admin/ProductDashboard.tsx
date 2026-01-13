import React from "react";
import DashboardLayout from "../Dashboard";
import { useGetProductsQuery } from "@/redux/query/productApi";
import {
  Package,
  Search,
  Plus,
  Filter,
  MoreVertical,
  Eye,
  Edit3,
  Trash2,
  Loader2,
  ArrowUpDown,
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
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const ProductDashboard: React.FC = () => {
  const { data: products = [], isLoading } = useGetProductsQuery();

  if (isLoading) return <PageLoader />;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-5xl font-black italic tracking-tighter mb-2">
              Global <span className="text-primary text-6xl">Inventory.</span>
            </h1>
            <p className="text-muted-foreground text-lg font-medium">
              Oversee all products currently circulating in the OASIS ecosystem.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="rounded-2xl h-14 px-8 font-black gap-2 shadow-xl shadow-primary/20"
          >
            <Link to="/products/manage/new">
              <Plus className="w-5 h-5" />
              Establish New Product
            </Link>
          </Button>
        </div>

        {/* Global Stats / Pulse */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/20 relative overflow-hidden group hover:bg-primary/10 transition-all duration-500">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <p className="text-xs font-black uppercase tracking-widest text-primary mb-1">
              Catalog Depth
            </p>
            <h3 className="text-5xl font-black italic tracking-tighter">
              {products.length}
            </h3>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-2">
              Active Unique Listings
            </p>
          </div>
          {/* Placeholder stats */}
          <div className="p-8 rounded-[2.5rem] bg-secondary/5 border border-border/50">
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">
              Stock Volatility
            </p>
            <h3 className="text-5xl font-black italic tracking-tighter">
              Normal
            </h3>
            <p className="text-xs font-bold text-green-500 uppercase tracking-widest mt-2">
              Efficiency: +12%
            </p>
          </div>
          <div className="p-8 rounded-[2.5rem] bg-secondary/5 border border-border/50">
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">
              Market Reach
            </p>
            <h3 className="text-5xl font-black italic tracking-tighter">
              Global
            </h3>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-2">
              12 Active Regions
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center bg-card/50 backdrop-blur-xl p-4 rounded-3xl border border-border/50">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Filter global inventory by title, SKU, or category..."
              className="h-12 pl-12 rounded-2xl bg-secondary/10 border-border/20"
            />
          </div>
          <Button
            variant="outline"
            className="h-12 rounded-2xl gap-2 font-bold px-6"
          >
            <Filter className="w-4 h-4" /> Attributes
          </Button>
          <Button
            variant="outline"
            className="h-12 rounded-2xl gap-2 font-bold px-6"
          >
            <ArrowUpDown className="w-4 h-4" /> Sort
          </Button>
        </div>

        {/* Inventory Table */}
        <div className="rounded-[2.5rem] bg-card/50 backdrop-blur-xl border border-border/50 overflow-hidden shadow-2xl">
          <Table>
            <TableHeader className="bg-secondary/20">
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="font-black italic uppercase tracking-widest text-[10px] py-6 pl-8">
                  Listing
                </TableHead>
                <TableHead className="font-black italic uppercase tracking-widest text-[10px]">
                  Merchant
                </TableHead>
                <TableHead className="font-black italic uppercase tracking-widest text-[10px]">
                  Price Reach
                </TableHead>
                <TableHead className="font-black italic uppercase tracking-widest text-[10px]">
                  Inventory
                </TableHead>
                <TableHead className="font-black italic uppercase tracking-widest text-[10px]">
                  Status
                </TableHead>
                <TableHead className="font-black italic uppercase tracking-widest text-[10px] text-right pr-8">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product: any) => (
                <TableRow
                  key={product.id}
                  className="border-border/20 hover:bg-primary/5 transition-colors group"
                >
                  <TableCell className="py-6 pl-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-secondary/30 overflow-hidden border border-border/20 shrink-0">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0].url}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <Package className="w-6 h-6 opacity-20" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-black italic text-lg leading-tight group-hover:text-primary transition-colors">
                          {product.title}
                        </p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          {product.category?.categoryName || "General"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black italic">
                        O
                      </div>
                      <span className="font-bold text-sm">Oasis Official</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-black italic text-lg text-primary">
                      ${product.variants?.[0]?.price || "0.00"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-bold text-sm">
                        {product.variants?.reduce(
                          (acc: number, v: any) => acc + (v.stock || 0),
                          0
                        )}{" "}
                        Total
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-40">
                        {product.variants?.length} Variants
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-green-500/10 text-green-500 border-green-500/20 font-black italic uppercase tracking-widest text-[8px]"
                    >
                      Circulating
                    </Badge>
                  </TableCell>
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
                          <Eye className="w-4 h-4" /> View Specs
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl gap-3 font-bold cursor-pointer">
                          <Edit3 className="w-4 h-4" /> Modify Config
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl gap-3 font-bold cursor-pointer text-destructive focus:bg-destructive/10">
                          <Trash2 className="w-4 h-4" /> Decommission
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {products.length === 0 && (
            <div className="p-20 text-center space-y-4">
              <Package className="w-20 h-20 text-muted-foreground/20 mx-auto" />
              <p className="text-xl font-black italic text-muted-foreground">
                The catalog is currently empty.
              </p>
              <Button
                asChild
                variant="outline"
                className="rounded-2xl h-12 font-black italic uppercase tracking-widest text-[10px]"
              >
                <Link to="/products/manage/new">
                  Establish Initial Inventory
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
      <p className="font-bold italic animate-pulse">
        Syncing global inventory pulse...
      </p>
    </div>
  </div>
);

export default ProductDashboard;
