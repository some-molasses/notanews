"use server";

import "./button.scss";

export const Button: React.FC<{
  children: React.ReactNode;
  handler: (...args: any[]) => Promise<void>;
}> = ({ children, handler }) => {
  return (
    <button className="main-button" formAction={handler}>
      {children}
    </button>
  );
};
