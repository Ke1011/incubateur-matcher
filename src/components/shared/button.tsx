import Link from "next/link"
import type { ReactNode } from "react"

interface ButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: "primary" | "ghost"
  size?: "default" | "lg"
  disabled?: boolean
  external?: boolean
  className?: string
  type?: "button" | "submit"
}

export function Button({
  children,
  href,
  onClick,
  variant = "primary",
  size = "default",
  disabled = false,
  external = false,
  className = "",
  type = "button",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-bold transition-all rounded-[10px] cursor-pointer select-none"

  const variants = {
    primary:
      "bg-accent-green text-bg-base shadow-[0_0_20px_rgba(34,197,94,0.25)] hover:bg-accent-green-hover hover:-translate-y-0.5 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:translate-y-0",
    ghost:
      "border-[1.5px] border-bg-border text-text-secondary hover:border-text-muted hover:text-text-primary hover:bg-bg-hover",
  }

  const sizes = {
    default: "h-12 px-6 text-sm",
    lg: "h-14 px-8 text-[15px]",
  }

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  )
}
