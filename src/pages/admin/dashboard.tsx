import { useGetAccountQuery } from "@/redux/query/dashboardApi";
import React from "react";

const Dashboard: React.FC = () => {
  const {
    data: accounts,
    isLoading: isGetAccountLoading,
    isError: isGetAccountError,
  } = useGetAccountQuery();

  if (isGetAccountError) return <p>isGetAccountError</p>;
  if (isGetAccountLoading) return <p>isGetAccountLoading</p>;
  console.log(accounts, " check at dashboard");

  return (
    <div>
      <h1></h1>
    </div>
  );
};

export default Dashboard;
