import type { HTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/utils";
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("card", className)} {...props} />;
}
export function Badge({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("badge", className)} {...props} />;
}
export function Alert({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div role="note" className={cn("alert", className)} {...props} />;
}
export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("textarea", className)} {...props} />;
}
export function Skeleton() {
  return <div aria-hidden="true" className="skeleton" />;
}
export function Progress({ value }: { value: number }) {
  return (
    <div
      className="progress"
      role="progressbar"
      aria-label="Match estimado"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span style={{ width: `${value}%` }} />
    </div>
  );
}
