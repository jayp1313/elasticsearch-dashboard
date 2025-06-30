import { Badge, BadgeProps } from "@/components/ui/badge";

type HealthStatus = "green" | "yellow" | "red";

interface HealthBadgeProps extends BadgeProps {
  status: HealthStatus;
}

export default function HealthBadge({ status, ...props }: HealthBadgeProps) {
  const statusConfig = {
    green: { label: "Healthy", variant: "success" },
    yellow: { label: "Warning", variant: "warning" },
    red: { label: "Critical", variant: "destructive" },
  };

  const { label, variant } = statusConfig[status] || statusConfig.green;

  return (
    <Badge variant={variant as any} {...props}>
      {label}
    </Badge>
  );
}
