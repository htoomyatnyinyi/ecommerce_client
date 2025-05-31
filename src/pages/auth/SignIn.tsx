import { useSignInMutation } from "@/redux/query/authApi";
import React, { useRef } from "react";

const SignIn: React.FC = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [signIn, { isLoading: isSignInLoading, isError: isSignInError }] =
    useSignInMutation();

  if (isSignInLoading) return <p>Loading</p>;
  if (isSignInError) return <p>Error</p>;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("SignIn");

    try {
      const email = emailRef.current?.value;
      const password = passwordRef.current?.value;
      const response = await signIn({ email, password });
      console.log(response, "return signin data");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <form onSubmit={handleSignIn}>
      <input type="text" ref={emailRef} placeholder="email" />
      <input type="password" ref={passwordRef} placeholder="password" />
      <button type="submit">SignIn </button>
    </form>
  );
};

export default SignIn;
