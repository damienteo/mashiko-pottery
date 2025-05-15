"use client";

import React, { ButtonHTMLAttributes, PropsWithChildren } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "confirm" | "cancel";
}

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: PropsWithChildren<ButtonProps>) {
  const baseStyles =
    "px-4 py-2 rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantStyles =
    variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
      : variant === "secondary"
        ? "bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400"
        : variant === "confirm"
          ? "bg-green-600 text-white hover:bg-green-700 active:bg-green-800"
          : "bg-red-600 text-white hover:bg-red-700 active:bg-red-800";

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
