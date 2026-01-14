import React, { useState } from "react";
import DashboardLayout from "../Dashboard";
import {
  User,
  Mail,
  MapPin,
  Phone,
  Shield,
  Bell,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useGetAddressesQuery,
  useCreateAddressMutation,
  useDeleteAddressMutation,
  useUpdateProfileMutation,
} from "@/redux/query/userApi";
import { useAuthMeQuery } from "@/redux/query/authApi";
import { toast } from "sonner";

const ProfileSettings: React.FC = () => {
  const { data: user } = useAuthMeQuery();
  const { data: addresses, isLoading: isAddressesLoading } =
    useGetAddressesQuery();
  const [createAddress, { isLoading: isCreatingAddress }] =
    useCreateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();

  const [activeTab, setActiveTab] = useState<
    "profile" | "addresses" | "security"
  >("profile");

  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-5xl font-black italic tracking-tighter mb-2">
              Profile <span className="text-primary">Settings.</span>
            </h1>
            <p className="text-muted-foreground text-lg font-medium">
              Manage your personal information and preferences.
            </p>
          </div>
        </div>

        {/* Settings Navigation */}
        <div className="flex gap-4 border-b border-border/50 pb-px overflow-x-auto no-scrollbar">
          <TabButton
            active={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
            icon={<User className="w-4 h-4" />}
            label="Personal Details"
          />
          <TabButton
            active={activeTab === "addresses"}
            onClick={() => setActiveTab("addresses")}
            icon={<MapPin className="w-4 h-4" />}
            label="Shipping Addresses"
          />
          <TabButton
            active={activeTab === "security"}
            onClick={() => setActiveTab("security")}
            icon={<Shield className="w-4 h-4" />}
            label="Security"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {activeTab === "profile" && <PersonalDetailsForm user={user} />}
            {activeTab === "addresses" && (
              <AddressManagement
                addresses={addresses}
                isLoading={isAddressesLoading}
                onCreate={createAddress}
                onDelete={deleteAddress}
              />
            )}
            {activeTab === "security" && <SecuritySettings />}
          </div>

          <div className="space-y-6">
            <Card className="rounded-[2.5rem] border-primary/20 bg-primary/5 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Bell className="w-24 h-24 text-primary" />
              </div>
              <h3 className="text-xl font-black italic mb-4">
                Notification Prefs
              </h3>
              <p className="text-sm text-muted-foreground mb-6 font-medium">
                Control what you want to hear from us.
              </p>
              <div className="space-y-4">
                <NotificationToggle label="Order Updates" defaultChecked />
                <NotificationToggle label="Price Drops" />
                <NotificationToggle label="Promotions" defaultChecked />
              </div>
            </Card>

            <Card className="rounded-[2.5rem] border-border/50 bg-secondary/10 p-8">
              <h3 className="text-xl font-black italic mb-4">Account Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold opacity-60">
                    Member Since
                  </span>
                  <span className="text-sm font-black italic">Jan 2024</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold opacity-60">
                    Trust Score
                  </span>
                  <span className="text-sm font-black italic text-green-500">
                    98%
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const TabButton = ({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-4 font-black italic tracking-tighter transition-all relative border-b-2 ${
      active
        ? "text-primary border-primary"
        : "text-muted-foreground border-transparent hover:text-foreground"
    }`}
  >
    {icon}
    {label}
  </button>
);

const PersonalDetailsForm = ({ user }: { user: any }) => {
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [username, setUsername] = useState(user?.username || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({ username }).unwrap();
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  return (
    <Card className="rounded-[2.5rem] border-border/50 bg-card p-10">
      <div className="mb-10">
        <h3 className="text-2xl font-black italic mb-2 tracking-tighter">
          Personal Info
        </h3>
        <p className="text-muted-foreground font-medium">
          Update your profile information.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <Label className="font-bold flex items-center gap-2">
              <User className="w-4 h-4 text-primary" /> Username
            </Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-14 rounded-2xl bg-secondary/20 border-border/50 px-6 font-bold"
            />
          </div>
          <div className="space-y-3">
            <Label className="font-bold flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" /> Email Address
            </Label>
            <Input
              defaultValue={user?.email}
              disabled
              className="h-14 rounded-2xl bg-secondary/10 border-border/50 px-6 font-bold opacity-50"
            />
          </div>
        </div>
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="h-14 px-10 rounded-2xl font-black italic shadow-lg shadow-primary/20"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : null}
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
};

const AddressManagement = ({
  addresses,
  isLoading,
  onCreate,
  onDelete,
}: any) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newAddr, setNewAddr] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
  });

  const handleAdd = async () => {
    try {
      await onCreate(newAddr).unwrap();
      toast.success("Address added successfully");
      setIsAdding(false);
      setNewAddr({
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "United States",
      });
    } catch (error) {
      toast.error("Failed to add address");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await onDelete(id).unwrap();
      toast.success("Address removed");
    } catch (error) {
      toast.error("Failed to remove address");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-black italic mb-1 tracking-tighter">
            Your Addresses
          </h3>
          <p className="text-muted-foreground font-medium">
            Manage your delivery locations.
          </p>
        </div>
        <Button
          onClick={() => setIsAdding(!isAdding)}
          className="rounded-2xl h-12 gap-2 font-bold px-6"
        >
          <Plus className="w-5 h-5" />
          Add New
        </Button>
      </div>

      {isAdding && (
        <Card className="rounded-[2.5rem] border-primary/20 bg-primary/5 p-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <Label className="font-bold">Street Address</Label>
              <Input
                value={newAddr.street}
                onChange={(e) =>
                  setNewAddr({ ...newAddr, street: e.target.value })
                }
                placeholder="123 Luxury Ave"
                className="h-12 rounded-xl bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold">City</Label>
              <Input
                value={newAddr.city}
                onChange={(e) =>
                  setNewAddr({ ...newAddr, city: e.target.value })
                }
                className="h-12 rounded-xl bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold">State / Province</Label>
              <Input
                value={newAddr.state}
                onChange={(e) =>
                  setNewAddr({ ...newAddr, state: e.target.value })
                }
                className="h-12 rounded-xl bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold">Postal Code</Label>
              <Input
                value={newAddr.postalCode}
                onChange={(e) =>
                  setNewAddr({ ...newAddr, postalCode: e.target.value })
                }
                className="h-12 rounded-xl bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold">Country</Label>
              <Input
                value={newAddr.country}
                onChange={(e) =>
                  setNewAddr({ ...newAddr, country: e.target.value })
                }
                className="h-12 rounded-xl bg-background"
              />
            </div>
          </div>
          <div className="mt-8 flex gap-4">
            <Button
              onClick={handleAdd}
              className="rounded-xl px-8 font-black italic"
            >
              Save Address
            </Button>
            <Button
              onClick={() => setIsAdding(false)}
              variant="ghost"
              className="rounded-xl px-8 font-bold"
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        ) : (
          addresses?.map((addr: any) => (
            <Card
              key={addr.id}
              className="rounded-[2rem] border-border/50 bg-card p-8 group hover:border-primary/30 transition-all"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="bg-secondary/30 p-4 rounded-2xl text-primary">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl h-10 w-10"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(addr.id)}
                    variant="ghost"
                    size="icon"
                    className="rounded-xl h-10 w-10 text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div>
                <p className="font-black italic tracking-tighter text-xl mb-1">
                  {addr.street}
                </p>
                <p className="text-muted-foreground font-medium">
                  {addr.city}, {addr.state} {addr.postalCode}
                </p>
                <p className="text-muted-foreground font-medium">
                  {addr.country}
                </p>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

const SecuritySettings = () => {
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    try {
      await updatePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      }).unwrap();
      toast.success("Password updated successfully");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update password");
    }
  };

  return (
    <Card className="rounded-[2.5rem] border-border/50 bg-card p-10">
      <div className="mb-10">
        <h3 className="text-2xl font-black italic mb-2 tracking-tighter">
          Security
        </h3>
        <p className="text-muted-foreground font-medium">
          Manage your password and security settings.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="font-bold">Current Password</Label>
            <Input
              type="password"
              value={formData.currentPassword}
              onChange={(e) =>
                setFormData({ ...formData, currentPassword: e.target.value })
              }
              className="h-14 rounded-2xl bg-secondary/20 border-border/50 px-6"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label className="font-bold">New Password</Label>
              <Input
                type="password"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                className="h-14 rounded-2xl bg-secondary/20 border-border/50 px-6"
                required
              />
            </div>
            <div className="space-y-3">
              <Label className="font-bold">Confirm New Password</Label>
              <Input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="h-14 rounded-2xl bg-secondary/20 border-border/50 px-6"
                required
              />
            </div>
          </div>
        </div>
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="h-14 px-10 rounded-2xl font-black italic shadow-lg shadow-primary/20"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : null}
            Update Password
          </Button>
        </div>
      </form>
    </Card>
  );
};

const NotificationToggle = ({
  label,
  defaultChecked = false,
}: {
  label: string;
  defaultChecked?: boolean;
}) => {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-background/50 border border-border/10">
      <span className="font-bold text-sm">{label}</span>
      <button
        onClick={() => setChecked(!checked)}
        className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${
          checked ? "bg-primary" : "bg-muted"
        }`}
      >
        <div
          className={`w-4 h-4 rounded-full bg-white transition-all duration-300 ${
            checked ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
};

export default ProfileSettings;
