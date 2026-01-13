import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
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
import { Link } from "react-router-dom";
import { toast } from "sonner";

const SignIn: React.FC = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [signIn, { isLoading: isSignInLoading, isError: isSignInError }] =
    useSignInMutation();

  if (isSignInLoading) return <p>Loading</p>;
  if (isSignInError) return <p>Error</p>;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const email = emailRef.current?.value;
      const password = passwordRef.current?.value;
      const responseSignIn = await signIn({ email, password });
      console.log(responseSignIn, "return data");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Button>
            <Link to="/signup">SignUp</Link>
          </Button>
          {/* <Button variant="link">Sign Up</Button> */}
        </CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignIn}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                ref={emailRef}
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" ref={passwordRef} required />
            </div>
          </div>
          <br />
          <div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast("Event has been created", {
              description: "Sunday, December 03, 2023 at 9:00 AM",
              action: {
                label: "Undo",
                onClick: () => console.log("Undo"),
              },
            })
          }
        >
          Show Toast
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SignIn;
