"use client";
import cn from "@/utils/cn";
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  children?: React.ReactNode;
};
const Button = ({ className, children, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className={cn(
        "rounded-md border bg-ligther p-2 text-xl transition duration-300 hover:bg-dark hover:text-light dark:border dark:border-gray-400 dark:bg-darker hover:dark:bg-light hover:dark:text-dark",
        className,
      )}
    >
      {children}
    </button>
  );
};

export default Button;
