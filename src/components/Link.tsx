"use client";
import React from "react";
import Link from "next/link";
import cn from "@/utils/cn";
import { usePathname } from "next/navigation";
const NavLink = ({
  className,
  children,
  href,
  currentPath,
}: {
  className?: string;
  children: React.ReactNode;
  href: string;
  currentPath?: string;
}) => {
  const pathname = usePathname();
  return (
    <li
      className={cn(
        `${pathname === href ? "bg-darker text-white dark:bg-white dark:text-black" : ""} w-full rounded-md border px-4 py-2 hover:bg-darker hover:text-white dark:border-0 dark:hover:bg-gray-200 dark:hover:text-black`,
        className,
      )}
    >
      <Link href={href}>{children}</Link>
    </li>
  );
};

export default NavLink;
