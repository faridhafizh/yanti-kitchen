import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

const buttonVariants = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
const buttonSizes = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10",
}
const buttonColors = {
  default: "bg-earth text-pale hover:bg-earth/90 shadow-sm border border-earth/20 transition-all duration-300",
  destructive: "bg-red-800 text-pale hover:bg-red-800/90",
  outline: "border border-earth/20 bg-pale hover:bg-cream hover:text-earth dark:border-earth/40 dark:bg-stone-900 dark:hover:bg-stone-800 dark:hover:text-cream transition-all duration-300",
  secondary: "bg-cream text-earth hover:bg-cream/80 dark:bg-stone-800 dark:text-cream dark:hover:bg-stone-800/80 transition-all duration-300",
  ghost: "hover:bg-cream hover:text-earth dark:hover:bg-stone-800 dark:hover:text-cream transition-all duration-300",
  link: "text-earth underline-offset-4 hover:underline dark:text-cream transition-all duration-300",
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: keyof typeof buttonColors
  size?: keyof typeof buttonSizes
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={`${buttonVariants} ${buttonColors[variant]} ${buttonSizes[size]} ${className || ""}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
