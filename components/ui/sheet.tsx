import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import { cn } from "@/lib/utils";

/**
 * Sheet (DESIGN.md, phone nav): Base UI's Dialog supplies the behaviour
 * (focus trap, focus return, Escape, scroll lock, dialog semantics); the
 * look lives in `.sheet*` rules in globals.css: capiz ground, hairline edge,
 * zero radius.
 */
function Sheet(props: SheetPrimitive.Root.Props) {
  return <SheetPrimitive.Root {...props} />;
}

function SheetTrigger({ className, ...props }: SheetPrimitive.Trigger.Props) {
  return (
    <SheetPrimitive.Trigger
      data-slot="sheet-trigger"
      className={cn("sheet-trigger", className)}
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  ...props
}: SheetPrimitive.Popup.Props) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Backdrop data-slot="sheet-backdrop" className="sheet-backdrop" />
      <SheetPrimitive.Popup
        data-slot="sheet-content"
        className={cn("sheet", className)}
        {...props}
      >
        {children}
      </SheetPrimitive.Popup>
    </SheetPrimitive.Portal>
  );
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("sheet-title", className)}
      {...props}
    />
  );
}

function SheetClose({ className, ...props }: SheetPrimitive.Close.Props) {
  return (
    <SheetPrimitive.Close
      data-slot="sheet-close"
      className={cn("sheet-close", className)}
      {...props}
    />
  );
}

export { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger };
