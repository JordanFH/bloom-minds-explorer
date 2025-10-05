import type * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary";
}

function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
  const baseClasses =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    default:
      "border-green-300 bg-green-200/50 text-green-600 hover:bg-green-300/50 focus:ring-green-300",
    secondary: "bg-primary/20 text-primary border-primary/30",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`.trim();

  return <div className={classes} {...props} />;
}

export { Badge };
