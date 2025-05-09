"use client";

import "./button.scss";

export const Button: React.FC<{
  children: React.ReactNode;
  handler: () => void;
}> = ({ children, handler }) => {
  return (
    <button className="main-button" onClick={() => handler()}>
      {children}
    </button>
  );
};
