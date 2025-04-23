import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

// Card component to wrap ingredients with for styling
const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div className={`border-2 border-black rounded-[12px] px-3 pl-4 py-2 text-black text-lg relative group bg-white text-oswald flex items-center gap-2 ${className}`}>
      {children}
    </div>
  );
};

export default Card;