"use client";
import Link from "next/link";
import { useState } from "react";
import {
  LayoutDashboard,
  Server,
  Settings,
  FileText,
  Filter,
  X,
  List,
} from "lucide-react";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      href: "/",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      href: "/indexes",
      label: "Index Management",
      icon: <Server className="h-5 w-5" />,
    },
    {
      href: "/mappings",
      label: "Mappings",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      href: "/aggregations",
      label: "Aggregations",
      icon: <Filter className="h-5 w-5" />,
    },
    { href: "/stopwords", label: "Stopwords", icon: <X className="h-5 w-5" /> },
    {
      href: "/synonyms",
      label: "Synonyms",
      icon: <List className="h-5 w-5" />,
    },
    {
      href: "/settings",
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white md:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <List className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 bg-gray-800 text-white transition-all duration-300
          ${isOpen ? "w-64 translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:w-64`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h1 className="text-xl font-bold">Elasticsearch Manager</h1>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            <ul>
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <div
                      className="flex items-center p-4 hover:bg-gray-700 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 text-sm text-gray-400 border-t border-gray-700">
            <p>Development Mode</p>
            <p>Using mock data</p>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
