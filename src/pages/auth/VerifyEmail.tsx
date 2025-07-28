import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useVerifyEmailTokenMutation } from "@/redux/query/authApi";

const VerifyEmail: React.FC = () => {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const verify_email_token = queryParams.get("token");

  const [
    verifyEmailToken,
    { isLoading: isVerifyEmailLoading, isError: isVerifyEmailError },
  ] = useVerifyEmailTokenMutation();

  useEffect(() => {
    if (verify_email_token) {
      handleVerifyEmail(verify_email_token);
    } else {
      console.error("No token found in the URL.");
    }
  }, [verify_email_token]);

  const handleVerifyEmail = async (token: string | null) => {
    if (!token) {
      console.error("No token provided for verification.");
      return;
    }
    try {
      console.log(token);
      const response = await verifyEmailToken({ token }).unwrap();
      console.log("Email verification response:", response);
      // You can redirect or show a success message here
      const navigate = useNavigate();
      navigate("/signin", { replace: true });
    } catch (error) {
      console.error("Error verifying email:", error);
      // Handle the error, e.g., show an error message to the user
    }
  };

  return (
    <div>
      <div>
        {isVerifyEmailError ? (
          <div>Error Verify Token</div>
        ) : (
          <div>
            {isVerifyEmailLoading ? (
              <div>Loading ...</div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <h1>Verify Email Token</h1>
                <p>{verify_email_token}</p>
                <h1>USER EMAIL VERIFY SUCCESSFULLY</h1>
                {/* <button
                  onClick={() => handleVerifyEmail(verify_email_token)}
                  className="border p-2 m-1"
                >
                  Click To Verify
                </button> */}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
