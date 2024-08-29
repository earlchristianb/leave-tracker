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
        `${pathname === href ? "border-b-2 border-darker font-semibold dark:border-light" : "bg-transparent"} w-full rounded-md px-4 py-2`,
        className,
      )}
    >
      <Link href={href}>{children}</Link>
    </li>
  );
};

export default NavLink;
