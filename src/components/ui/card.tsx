import type React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card = ({ children, className = "", ...props }: CardProps) => {
  const classes =
    `rounded-lg border border-border bg-card text-card-foreground shadow-sm ${className}`.trim();

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = "", ...props }: CardHeaderProps) => {
  const classes = `flex flex-col space-y-1.5 p-6 ${className}`.trim();

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

const CardTitle = ({ children, className = "", ...props }: CardTitleProps) => {
  const classes = `text-2xl font-semibold leading-none tracking-tight ${className}`.trim();

  return (
    <h3 className={classes} {...props}>
      {children}
    </h3>
  );
};

const CardDescription = ({ children, className = "", ...props }: CardDescriptionProps) => {
  const classes = `text-sm text-muted-foreground ${className}`.trim();

  return (
    <p className={classes} {...props}>
      {children}
    </p>
  );
};

const CardContent = ({ children, className = "", ...props }: CardContentProps) => {
  const classes = `p-6 pt-0 ${className}`.trim();

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

const CardFooter = ({ children, className = "", ...props }: CardFooterProps) => {
  const classes = `flex items-center p-6 pt-0 ${className}`.trim();

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
