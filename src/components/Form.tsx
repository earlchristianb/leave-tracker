import cn from "@/utils/cn";
import React from "react";
type FormProps = React.FormHTMLAttributes<HTMLFormElement> & {
  children: React.ReactNode;
};
const Form = ({ children, ...props }: FormProps) => {
  return (
    <form
      {...props}
      className={cn(
        "flex flex-col justify-center space-y-4 rounded-md border p-4 dark:border-gray-400 dark:bg-darker",
        props.className,
      )}
    >
      {children}
    </form>
  );
};

export default Form;
