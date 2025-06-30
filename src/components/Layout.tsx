// "use client";
// import { HomeIcon, CogIcon } from "@heroicons/react/24/outline";
// import Link from "next/link";
// import { ReactNode } from "react";

// interface LayoutProps {
//   children: ReactNode;
// }

// const Sidebar = () => (
//   <div className="w-64 bg-gray-800 text-white h-screen">
//     <nav>
//       <ul>
//         <li>
//           <Link href="/">
//             <div className="flex items-center p-4 hover:bg-gray-700">
//               <HomeIcon className="h-6 w-6" />
//               <span className="ml-2">Dashboard</span>
//             </div>
//           </Link>
//         </li>
//         <li>
//           <Link href="/indexes">
//             <div className="flex items-center p-4 hover:bg-gray-700">
//               <span className="ml-2">Index Management</span>
//             </div>
//           </Link>
//         </li>
//         <li>
//           <Link href="/settings">
//             <div className="flex items-center p-4 hover:bg-gray-700">
//               <CogIcon className="h-6 w-6" />
//               <span className="ml-2">Settings</span>
//             </div>
//           </Link>
//         </li>
//         <li>
//           <Link href="/mappings">
//             <div className="flex items-center p-4 hover:bg-gray-700">
//               <span className="ml-2">Mappings</span>
//             </div>
//           </Link>
//         </li>
//       </ul>
//     </nav>
//   </div>
// );

// const Layout: React.FC<LayoutProps> = ({ children }) => (
//   <div className="flex">
//     <Sidebar />
//     <main className="flex-1 p-4">{children}</main>
//   </div>
// );

// export default Layout;
