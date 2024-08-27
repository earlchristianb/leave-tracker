/** @format */
"use client";
import { useState } from "react";
import { createContext, useContextSelector } from "use-context-selector";
import React from "react";
import { Toast } from "@/types/toast.type";
const useToastStore = () => {
  const [toastList, setToastList] = useState<Toast[] | []>([]);

  const createId = () => Math.floor(Math.random() * 10000);

  const createToast = (type: string, text: string) => {
    const toastId = createId();
    const newToast = {
      type: type,
      text: text,
      toastId: toastId,
    };
    setToastList((prev) => [...prev, newToast]);
  };

  const removeToast = (id: number) => {
    setToastList((prev) => {
      return [...prev.filter((toast) => toast.toastId !== id && toast)];
    });
  };

  return {
    createToast,
    setToastList,
    toastList,
    removeToast,
  };
};

type ToastContextType = ReturnType<typeof useToastStore>;

const ToastContext = createContext<ToastContextType>({
  createToast: () => {},
  setToastList: () => {},
  toastList: [],
  removeToast: () => {},
});
export const ToastContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <ToastContext.Provider value={useToastStore()}>
    {children}
  </ToastContext.Provider>
);

export const useToastList = () =>
  useContextSelector(ToastContext, (state) => state.toastList);
export const useSetToastList = () =>
  useContextSelector(ToastContext, (state) => state.setToastList);
export const useCreateToast = () =>
  useContextSelector(ToastContext, (state) => state.createToast);
export const useRemoveToast = () =>
  useContextSelector(ToastContext, (state) => state.removeToast);
