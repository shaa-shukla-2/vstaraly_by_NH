import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  variant?: "primary" | "outline" | "ghost" | "gold";
  size?: "sm" | "md";
};

export function Button({
  className,
  href,
  variant = "primary",
  size = "md",
  ...props
}: Props) {
  const styles = cn(
    "inline-flex items-center justify-center tracking-[0.18em] uppercase text-[11px] transition-colors disabled:opacity-40",
    size === "md" ? "px-6 py-3" : "px-4 py-2",
    variant === "primary" && "bg-wine text-ivory hover:bg-wine-deep",
    variant === "outline" && "border border-espresso/25 text-espresso hover:border-espresso",
    variant === "ghost" && "text-espresso hover:text-wine",
    variant === "gold" && "bg-espresso text-ivory hover:bg-charcoal",
    className,
  );
  if (href) {
    const { children, onClick } = props;
    return (
      <Link href={href} className={styles} onClick={onClick as never}>
        {children}
      </Link>
    );
  }
  return <button className={styles} {...props} />;
}
