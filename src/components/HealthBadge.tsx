import { Badge, BadgeProps } from "@/components/ui/badge";

interface HealthBadgeProps extends BadgeProps {
  status: string;
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
