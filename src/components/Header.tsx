import { SidebarTrigger } from "./ui/sidebar";

export function Header({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between border-b pb-5 top-0 z-40">
      <div className="md:hidden">
        <SidebarTrigger size="icon" />
      </div>

      <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
    </div>
  );
}
