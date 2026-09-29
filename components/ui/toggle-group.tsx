import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import { cn } from "@/lib/utils";

/**
 * Toggle Group (DESIGN.md, the grader): Base UI supplies the behaviour (one
 * tab stop, arrow-key roving, Space/Enter to press, `aria-pressed`); the look
 * lives in `.toggle-group` and `.toggle-item` rules in globals.css: square,
 * hairline, ink when pressed.
 */
function ToggleGroup({ className, ...props }: ToggleGroupPrimitive.Props<string>) {
  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      className={cn("toggle-group", className)}
      {...props}
    />
  );
}

function ToggleGroupItem({ className, ...props }: TogglePrimitive.Props<string>) {
  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      className={cn("toggle-item", className)}
      {...props}
    />
  );
}

export { ToggleGroup, ToggleGroupItem };
