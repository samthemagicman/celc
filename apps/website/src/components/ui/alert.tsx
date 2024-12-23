import { VariantProps, cva } from "class-variance-authority";
import React from "react";
import { cn } from "~/lib/utils";

const alertVariants = cva(
  "bg-gray-300 outline-gray-400 outline rounded-md p-2",
  {
    variants: {
      variant: {
        default: "",
        error: "bg-red-300 text-red-900 outline-red-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type AlertProps = VariantProps<typeof alertVariants> & {
  children: React.ReactNode;
  className?: string;
};

const Alert: React.FC<AlertProps> = ({ children, ...rest }) => {
  return (
    <div
      className={cn(
        alertVariants({
          className: rest.className,
          variant: rest.variant,
        }),
      )}
    >
      {children}
    </div>
  );
};

export default Alert;
