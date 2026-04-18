import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ hover, className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`bg-[#0d0d0d] border border-[#222] rounded-2xl ${
        hover ? "hover:border-[#444] transition-colors cursor-pointer" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
