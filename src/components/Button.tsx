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
        "bg-lighter dark:bg-darkest dark:text-lighter rounded-md p-2 text-xl transition duration-300 hover:bg-darker hover:text-light hover:dark:bg-light hover:dark:text-darker",
        className,
      )}
    >
      {children}
    </button>
  );
};

export default Button;
