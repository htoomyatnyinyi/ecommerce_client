import React from "react";
import Dashboard from "../Dashboard";
import { useGetCartQuery, useGetProductsQuery } from "@/redux/query/productApi";

const AdminDashboard: React.FC = () => {
  const { data: getProducts } = useGetProductsQuery();
  const { data: getCarts } = useGetCartQuery();
  console.log(getProducts?.products, " dashboard");
  console.log(getCarts?.getCart, " dashboard");
  return (
    <Dashboard>
      <div>
        <h1>Admin Dashboard</h1>
        {/* Your admin content here */}
        <div className="border">
          {getProducts?.products.map((product: any) => (
            <div>{product.title}</div>
          ))}
        </div>
        <div className="border">
          {getCarts?.getCart.map((cart: any) => (
            <div>{cart.quantity}</div>
          ))}
          <p>{getCarts?.totalPrice}</p>
        </div>
      </div>
    </Dashboard>
  );
};

export default AdminDashboard;
