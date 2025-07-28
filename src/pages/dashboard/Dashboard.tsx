import React from "react";
import Sidebar from "./Sidebar";

const Dashboard: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <div className="flex min-h-screen ">
      <Sidebar />
      <main className="flex-1 p-4 ">{children}</main>
    </div>
  );
};

export default Dashboard;

// // import React from "react";
// // import Sidebar from "./Sidebar";
// // // import AdminDashboard from "./admin/Admin";

// // const Dashboard = ({ children }: { children: React.ReactNode }) => {
// //   return (
// //     <div className="h-screen">
// //       <div className="">
// //         <div className="grid grid-cols-12 gap-4">
// //           <div className="col-span-2 aspect-square ">
// //             <Sidebar />
// //           </div>
// //           <div className="col-span-10 aspect-square ">
// //             {/* <AdminDashboard /> */}
// //             {children}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Dashboard;
