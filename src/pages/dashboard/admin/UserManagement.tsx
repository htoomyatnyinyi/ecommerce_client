import React from "react";
import DashboardLayout from "../Dashboard";
import {
  useGetAccountQuery,
  useUpdateAccountMutation,
  useDeleteAccuntMutation,
} from "@/redux/query/dashboardApi";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MoreVertical,
  Shield,
  User,
  ShoppingBag,
  Trash2,
  Loader2,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const UserManagement: React.FC = () => {
  const { data: users = [], isLoading } = useGetAccountQuery(undefined);
  const [updateAccount] = useUpdateAccountMutation();
  const [deleteAccount] = useDeleteAccuntMutation();

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateAccount({ id: userId, role: newRole }).unwrap();
    } catch (err) {
      console.error("Failed to update role:", err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteAccount(userId).unwrap();
      } catch (err) {
        console.error("Failed to delete user:", err);
      }
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
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-5xl font-black italic tracking-tighter mb-2">
              User <span className="text-primary text-6xl">Accounts.</span>
            </h1>
            <p className="text-muted-foreground text-lg font-medium">
              Manage permissions and ecosystem access for all citizens.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search identities..."
                className="h-14 pl-12 rounded-2xl bg-secondary/10 border-border/20 w-80 font-bold"
              />
            </div>
          </div>
        </div>

        {/* User Table */}
        <div className="rounded-[2.5rem] bg-card/50 backdrop-blur-xl border border-border/50 overflow-hidden shadow-2xl">
          <Table>
            <TableHeader className="bg-secondary/20">
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="font-black italic uppercase tracking-widest text-[10px] py-6 pl-8">
                  Identity
                </TableHead>
                <TableHead className="font-black italic uppercase tracking-widest text-[10px]">
                  Current Role
                </TableHead>
                <TableHead className="font-black italic uppercase tracking-widest text-[10px]">
                  Verification
                </TableHead>
                <TableHead className="font-black italic uppercase tracking-widest text-[10px]">
                  Joined
                </TableHead>
                <TableHead className="font-black italic uppercase tracking-widest text-[10px] text-right pr-8">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: any) => (
                <TableRow
                  key={user.id}
                  className="border-border/20 hover:bg-primary/5 transition-colors group"
                >
                  <TableCell className="py-6 pl-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        {user.role === "ADMIN" ? (
                          <Shield className="w-6 h-6" />
                        ) : user.role === "EMPLOYER" ? (
                          <ShoppingBag className="w-6 h-6" />
                        ) : (
                          <User className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <p className="font-black italic text-lg leading-tight group-hover:text-primary transition-colors">
                          {user.username}
                        </p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="font-black italic uppercase tracking-widest text-[10px] bg-secondary/10 border-border/50 py-1 px-3 rounded-lg"
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-black italic uppercase tracking-widest text-[8px] py-0.5 px-2",
                        user.isEmailVerified
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                      )}
                    >
                      {user.isEmailVerified ? "Verified" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm font-bold text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
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
                        <DropdownMenuItem
                          className="rounded-xl gap-3 font-bold cursor-pointer"
                          onClick={() => handleRoleChange(user.id, "ADMIN")}
                        >
                          <Shield className="w-4 h-4" /> Promote to Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="rounded-xl gap-3 font-bold cursor-pointer"
                          onClick={() => handleRoleChange(user.id, "EMPLOYER")}
                        >
                          <ShoppingBag className="w-4 h-4" /> Grant Merchant
                          Rights
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="rounded-xl gap-3 font-bold cursor-pointer"
                          onClick={() => handleRoleChange(user.id, "USER")}
                        >
                          <User className="w-4 h-4" /> Reset to User
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="rounded-xl gap-3 font-bold cursor-pointer text-destructive focus:bg-destructive/10"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="w-4 h-4" /> Revoke Access
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

export default UserManagement;
