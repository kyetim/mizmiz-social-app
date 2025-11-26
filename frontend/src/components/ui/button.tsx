import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive backdrop-blur-xl",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-[0_10px_35px_rgba(16,185,129,0.35)] hover:shadow-[0_12px_45px_rgba(8,145,178,0.45)]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm hover:shadow-md focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border border-white/30 bg-white/10 text-foreground shadow-[0_10px_35px_rgba(15,23,42,0.25)] hover:bg-white/20 dark:border-white/10 dark:text-white",
        secondary:
          "bg-white/70 text-foreground shadow-[0_5px_25px_rgba(15,23,42,0.18)] hover:bg-white dark:bg-slate-800/70 dark:text-white dark:hover:bg-slate-800",
        ghost:
          "hover:bg-white/20 hover:text-foreground dark:hover:bg-white/5 dark:hover:text-white text-foreground/80 dark:text-white/80",
        link: "text-emerald-500 underline-offset-4 hover:underline dark:text-emerald-300",
        success:
          "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-[0_10px_30px_rgba(16,185,129,0.35)] hover:shadow-[0_12px_35px_rgba(16,185,129,0.45)]",
        warning:
          "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-[0_10px_30px_rgba(245,158,11,0.35)] hover:shadow-[0_12px_35px_rgba(245,158,11,0.45)]",
        info:
          "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-[0_10px_30px_rgba(14,165,233,0.35)] hover:shadow-[0_12px_35px_rgba(14,165,233,0.45)]",
      },
      size: {
        default: "h-11 px-5 py-2.5 gap-2 rounded-2xl",
        sm: "h-9 px-4 py-2 gap-1.5 text-xs rounded-xl",
        lg: "h-12 px-6 py-3 gap-2.5 text-base rounded-3xl",
        xl: "h-14 px-8 py-4 gap-3 text-lg rounded-[32px]",
        icon: "size-11",
        "icon-sm": "size-8",
        "icon-lg": "size-13",
        "icon-xl": "size-16",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
