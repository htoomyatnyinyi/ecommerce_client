import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useVerifyEmailTokenMutation } from "@/redux/query/authApi";

const VerifyEmail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const verify_email_token = queryParams.get("token");

  const [
    verifyEmailToken,
    { isLoading: isVerifyEmailLoading, isError: isVerifyEmailError },
  ] = useVerifyEmailTokenMutation();

  useEffect(() => {
    if (verify_email_token) {
      handleVerifyEmail(verify_email_token);
    }
  }, [verify_email_token]);

  const handleVerifyEmail = async (token: string) => {
    try {
      await verifyEmailToken({ token }).unwrap();
      // Redirect to signin after a short delay or immediately
      navigate("/signin", { replace: true });
    } catch (error) {
      console.error("Error verifying email:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="max-w-md w-full p-8 bg-card rounded-2xl shadow-xl">
        <h1 className="text-3xl font-black italic tracking-tighter mb-6 text-center">
          Verify Email.
        </h1>

        {isVerifyEmailError ? (
          <div className="p-4 bg-destructive/10 border border-destructive/50 rounded-xl text-destructive text-center">
            <p className="font-bold">Verification Failed</p>
            <p className="text-sm mt-1">
              The token might be invalid or expired.
            </p>
          </div>
        ) : (
          <div className="text-center">
            {isVerifyEmailLoading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-muted-foreground font-medium">
                  Verifying your account...
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-primary/10 border border-primary/50 rounded-xl text-primary">
                  <p className="font-bold text-lg">Verification Successful!</p>
                  <p className="text-sm mt-1">
                    Your email has been verified. Redirecting you to login...
                  </p>
                </div>
                <p className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded">
                  Token: {verify_email_token?.substring(0, 10)}...
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
