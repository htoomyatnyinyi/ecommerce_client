import React from "react";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => (
  <aside className="w-64  p-4">
    <nav>
      <ul>
        <li className="mb-2">
          {/* <a href="/dashboard">Admin</a> */}
          <Link to="/dashboard">Admin</Link>
        </li>
        <li className="mb-2">
          <Link to="/dashboard/products">Products</Link>
        </li>
        {/* Add more links as needed */}
      </ul>
    </nav>
  </aside>
);

export default Sidebar;
// import { Link } from "react-router-dom";

// const Sidebar = () => {
//   return (
//     <div className="h-screen">
//       <div className="container mx-auto gap-8">
//         <div className="flex flex-col items-center justify-center pt-3 pb-4  ">
//           <Link to="/dashboard/admin/overviews" className=" pt-10 pb-10 ">
//             Overviews
//           </Link>
//           <Link to="/dashboard/admin/products">Show Products</Link>
//           <Link to="/dashboard/admin/edit">Show Products</Link>
//           <Link to="/dashboard/admin/update">Show Products</Link>
//           <Link to="/dashboard/admin/add">Show Products</Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
