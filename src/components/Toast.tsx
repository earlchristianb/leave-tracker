/** @format */
"use client";
import { ToastDuration, ToastType } from "@/constants/toast.constants";
import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faExclamation,
  faInfo,
  faClose,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";

const CustomToast = ({
  removeToast,
  text,
  type,
  toastId,
}: {
  removeToast: (id: number) => void;
  text: string;
  type: string;
  toastId: number;
}) => {
  useEffect(() => {
    setTimeout(() => {
      removeToast(toastId);
    }, ToastDuration);
  }, []);

  const getToastDesign = (type: string) => {
    switch (type) {
      case ToastType.ERROR:
        return "bg-red-500 text-black dark:text-white";
      case ToastType.SUCCESS:
        return "bg-green-500 text-black dark:text-white";
      case ToastType.WARNING:
        return "bg-yellow-500 text-black dark:text-white";
      case ToastType.INFO:
        return "bg-blue-500 text-black dark:text-white";
      default:
        return "";
    }
  };

  const getToastIcon = (type: string) => {
    switch (type) {
      case ToastType.ERROR:
        return (
          <FontAwesomeIcon
            className="p-1 text-xl dark:text-white"
            icon={faXmarkCircle}
          />
        );
      case ToastType.SUCCESS:
        return (
          <FontAwesomeIcon
            className="p-1 text-xl dark:text-white"
            icon={faThumbsUp}
          />
        );
      case ToastType.WARNING:
        return (
          <FontAwesomeIcon
            className="p-1 text-xl dark:text-white"
            icon={faExclamation}
          />
        );
      case ToastType.INFO:
        return (
          <FontAwesomeIcon
            className="p-1 text-xl dark:text-white"
            icon={faInfo}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`flex min-w-full items-center justify-start space-x-3 rounded-md px-2 py-1.5 md:w-96 ${getToastDesign(
        type,
      )}`}
    >
      <div className="flex w-7 items-center">{getToastIcon(type)}</div>
      <div className="flex w-full flex-col items-center justify-start">
        <label className="text-subtitle1 w-full">{type}</label>
        <label className="text-body2 max-h-24 w-full overflow-y-auto whitespace-pre-line">
          {text}
        </label>
      </div>
      <button onClick={() => removeToast(toastId)}>
        <FontAwesomeIcon
          icon={faClose}
          className="p-1 text-xl dark:text-white"
        />
      </button>
    </div>
  );
};

export default CustomToast;
