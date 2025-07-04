"use client";
import Link from "next/link";
import {
  LayoutDashboard,
  Server,
  Settings,
  FileText,
  Filter,
  X,
  List,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

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

export function AppSidebar() {
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Sidebar className="fixed inset-y-0 left-0 z-40 w-72 !bg-gray-800">
      <SidebarHeader className="p-6 border-b border-gray-700 bg-gray-800 text-white">
        <h1 className="text-xl font-bold">Elasticsearch Manager</h1>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto py-4 bg-gray-800 text-white">
        <SidebarGroup>
          {menuItems.map((item) => (
            <div key={item.href}>
              <Link
                href={item.href}
                onClick={() => {
                  if (isMobile && pathname !== item.href) toggleSidebar();
                }}
                className="flex items-center p-4 hover:underline"
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </div>
          ))}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
