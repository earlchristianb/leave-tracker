/** @format */
"use client";
import React from "react";

import { useRemoveToast, useToastList } from "@/providers/ToastProvider";
import CustomToast from "./Toast";
import { Toast } from "@/types/toast.type";

const ToastList = () => {
  const toastList: Toast[] = useToastList();
  const removeToast = useRemoveToast();

  return (
    <div className="fixed right-5 top-5 z-30 space-y-2">
      {toastList.map(({ type, text, toastId }) => (
        <CustomToast
          key={toastId}
          removeToast={removeToast}
          text={text}
          toastId={toastId}
          type={type}
        />
      ))}
    </div>
  );
};

export default ToastList;
