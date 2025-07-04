import { List } from "lucide-react";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";

export function Header({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between py-4 border-b  top-0 z-40">
      <div className="md:hidden">
        <SidebarTrigger>
          <Button
            variant="ghost"
            size="icon"
            className="bg-gray-800 text-white"
          >
            <List className="h-6 w-6" />
          </Button>
        </SidebarTrigger>
      </div>

      <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
    </div>
  );
}
