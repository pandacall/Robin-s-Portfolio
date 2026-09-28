import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Buttons component (DESIGN.md): square, 50px, ink border, ink-wipe hover.
 * "primary" is the one filled-narra surface per viewport (The Narra Once Rule).
 */
const buttonVariants = cva("btn", {
  variants: {
    variant: {
      hairline: "",
      primary: "primary",
    },
  },
  defaultVariants: {
    variant: "hairline",
  },
});

function Button({
  className,
  variant = "hairline",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
