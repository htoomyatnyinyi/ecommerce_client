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

import { useSignInMutation } from "@/redux/query/authApi";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ShieldCheck, ArrowRight, Loader2, Mail, Lock } from "lucide-react";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [signIn, { isLoading }] = useSignInMutation();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const email = emailRef.current?.value;
      const password = passwordRef.current?.value;

      const response = await signIn({ email, password }).unwrap();

      // Handle both nested { user: { role } } and un-nested { role }
      const userData = response.user || response;
      const userRole = userData.role;
      const username = userData.username || "User";

      toast.success(`Welcome back, ${username}!`);

      // Role-based redirection
      switch (userRole) {
        case "ADMIN":
          navigate("/dashboard");
          break;
        case "EMPLOYER":
          navigate("/employer/dashboard");
          break;
        case "USER":
          navigate("/");
          break;
        default:
          navigate("/");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background p-4 pt-24 pb-12">
      <Card className="w-full max-w-sm rounded-[2.5rem] border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-purple-500 to-primary/50" />

        <CardHeader className="space-y-4 text-center pt-8">
          <div className="mx-auto bg-primary/10 p-4 rounded-3xl w-fit mb-2">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-4xl font-black italic tracking-tighter">
            Welcome <span className="text-primary">Back.</span>
          </CardTitle>
          <CardDescription className="text-lg font-medium">
            Enter your credentials to access your oasis.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-4 pt-4">
          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="font-bold ml-1 flex items-center gap-2"
              >
                <Mail className="w-4 h-4" /> Email
              </Label>
              <Input
                id="email"
                type="email"
                ref={emailRef}
                placeholder="m@example.com"
                required
                className="h-14 rounded-2xl bg-secondary/20 border-border/50 focus-visible:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <Label
                  htmlFor="password"
                  className="font-bold flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" /> Password
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-bold text-primary hover:underline underline-offset-4"
                >
                  Forgot?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                ref={passwordRef}
                required
                className="h-14 rounded-2xl bg-secondary/20 border-border/50 focus-visible:ring-primary/20"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-14 rounded-2xl text-lg font-black italic group transition-all mt-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
            <div className="flex justify-center mt-2">
              <Button asChild variant="link" className="p-0 h-auto">
                <Link to="/signup" className="font-bold text-sm">
                  Don't have an account? Sign Up
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-center gap-4 border-t border-border/10 bg-secondary/5 py-6">
          <Button
            variant="outline"
            className="w-[85%] h-12 rounded-xl border-border/50 bg-background font-bold gap-3"
          >
            <img
              src="https://www.google.com/favicon.ico"
              className="w-4 h-4"
              alt="Google"
            />
            Google Account
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;
