import cn from "@/utils/cn";

const Column = ({
  children,
  additionalClassName,
}: {
  children: React.ReactNode;
  additionalClassName?: string;
}) => {
  return (
    <p
      className={cn(
        "w-40 min-w-40 text-left text-darker group-hover:bg-light group-hover:text-white dark:text-white group-hover:dark:bg-slate-100 group-hover:dark:text-darker lg:w-full",
        additionalClassName,
      )}
    >
      {children}
    </p>
  );
};

export default Column;
