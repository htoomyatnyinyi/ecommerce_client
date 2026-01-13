import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignUpMutation } from "@/redux/query/authApi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  User,
  Briefcase,
  ShieldCheck,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SignUp = () => {
  const navigate = useNavigate();
  const [signUp, { isLoading }] = useSignUpMutation();
  const [role, setRole] = useState<"USER" | "EMPLOYER" | "ADMIN">("USER");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRoleSelect = (selectedRole: "USER" | "EMPLOYER" | "ADMIN") => {
    setRole(selectedRole);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await signUp({ ...formData, role }).unwrap();
      toast.success("Account created successfully! Please verify your email.");
      navigate("/signin");
    } catch (error: any) {
      toast.error(error?.data?.message || "SignUp failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 py-24">
      <Card className="w-full max-w-xl rounded-[2.5rem] border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-purple-500 to-primary/50" />

        <CardHeader className="space-y-4 text-center pt-8">
          <CardTitle className="text-4xl font-black italic tracking-tighter">
            Join <span className="text-primary">OASIS.</span>
          </CardTitle>
          <CardDescription className="text-lg font-medium">
            Choose your role and start your journey with us.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          {/* Role Selection */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <RoleCard
              title="Shopper"
              roleType="USER"
              isSelected={role === "USER"}
              onClick={() => handleRoleSelect("USER")}
              icon={<User className="w-6 h-6" />}
            />
            <RoleCard
              title="Merchant"
              roleType="EMPLOYER"
              isSelected={role === "EMPLOYER"}
              onClick={() => handleRoleSelect("EMPLOYER")}
              icon={<Briefcase className="w-6 h-6" />}
            />
            <RoleCard
              title="Admin"
              roleType="ADMIN"
              isSelected={role === "ADMIN"}
              onClick={() => handleRoleSelect("ADMIN")}
              icon={<ShieldCheck className="w-6 h-6" />}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="font-bold ml-1">
                  Username
                </Label>
                <Input
                  id="username"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={handleChange}
                  className="h-12 rounded-2xl bg-secondary/20 border-border/50 focus-visible:ring-primary/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="font-bold ml-1">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="h-12 rounded-2xl bg-secondary/20 border-border/50 focus-visible:ring-primary/20"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="font-bold ml-1">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="h-12 rounded-2xl bg-secondary/20 border-border/50 focus-visible:ring-primary/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="font-bold ml-1">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="h-12 rounded-2xl bg-secondary/20 border-border/50 focus-visible:ring-primary/20"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-14 rounded-2xl text-lg font-black italic group transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Create{" "}
                  {role === "USER"
                    ? "Account"
                    : role === "EMPLOYER"
                    ? "Store"
                    : "Admin Panel"}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-border/10 bg-secondary/5 py-6">
          <p className="text-muted-foreground font-medium">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-primary font-black hover:underline underline-offset-4"
            >
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

interface RoleCardProps {
  title: string;
  roleType: string;
  isSelected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}

const RoleCard = ({ title, isSelected, onClick, icon }: RoleCardProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all duration-300 gap-2",
      isSelected
        ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(var(--primary),0.1)]"
        : "bg-secondary/20 border-transparent grayscale hover:grayscale-0 hover:bg-secondary/40"
    )}
  >
    <div
      className={cn(
        "p-3 rounded-2xl transition-colors",
        isSelected
          ? "bg-primary text-primary-foreground"
          : "bg-background/50 text-muted-foreground"
      )}
    >
      {icon}
    </div>
    <span
      className={cn(
        "font-black text-sm uppercase tracking-widest",
        isSelected ? "text-primary" : "text-muted-foreground"
      )}
    >
      {title}
    </span>
    {isSelected && (
      <div className="h-1.5 w-1.5 rounded-full bg-primary absolute top-4 right-4" />
    )}
  </button>
);

export default SignUp;
