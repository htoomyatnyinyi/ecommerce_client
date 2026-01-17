// import { useGetAccountQuery } from "@/redux/query/dashboardApi";
// import React from "react";

// const Dashboard: React.FC = () => {
//   const {
//     data: accounts,
//     isLoading: isGetAccountLoading,
//     isError: isGetAccountError,
//   } = useGetAccountQuery({});

//   if (isGetAccountError) return <p>isGetAccountError</p>;
//   if (isGetAccountLoading) return <p>isGetAccountLoading</p>;

//   return (
//     <div>
//       <h1>This is admin dashboard</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
//         {accounts?.map((account: any) => (
//           <div
//             key={account.id}
//             className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
//           >
//             <h2 className="text-xl font-semibold">{account.name}</h2>
//             <p>Email: {account.email}</p>
//             <p>Role: {account.role}</p>
//             <p>
//               Created At: {new Date(account.createdAt).toLocaleDateString()}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
