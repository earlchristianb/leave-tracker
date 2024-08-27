import cn from "@/utils/cn";
import React from "react";
type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

const Input = (props: InputProps) => {
  const { className } = props;
  return (
    <input
      {...props}
      className={cn(
        "w-full border-b border-dark p-1 dark:bg-gray-400",
        className,
      )}
    />
  );
};

export default Input;
