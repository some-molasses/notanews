export type ButtonProps = {
  children: React.ReactNode;
  handler?: ((formData: FormData) => void) | (() => void);
  href?: string;
  variant?: "default" | "destructive";
};
