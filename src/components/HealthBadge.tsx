import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function HealthBadge({ color }: { color: string }) {
  const statusConfig = {
    green: {
      label: "Healthy",
      className: "bg-green-600 hover:bg-green-700",
    },
    yellow: {
      label: "Warning",
      className: "bg-yellow-600 hover:bg-yellow-600",
    },
    red: {
      label: "Critical",
      className: "bg-red-600 hover:bg-red-700",
    },
    default: {
      label: "Unknown",
      className: "bg-gray-500 hover:bg-gray-600",
    },
  };

  const { label, className } =
    statusConfig[color as keyof typeof statusConfig] || statusConfig.default;

  return <Badge className={cn("text-white", className)}>{label}</Badge>;
}
