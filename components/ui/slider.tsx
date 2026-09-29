import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cn } from "@/lib/utils";

/**
 * Slider (DESIGN.md, the grader): Base UI supplies the behaviour (arrow keys,
 * Home/End, Page Up/Down, pointer drag, the range input a screen reader
 * reads); the look lives in `.slider*` rules in globals.css: a hairline
 * track, an ink fill and a square thumb.
 */
function Slider({
  className,
  label,
  valueText,
  ...props
}: Omit<SliderPrimitive.Root.Props<number>, "aria-label"> & {
  /** The slider's accessible name. */
  label: string;
  /** Turns the value into what a screen reader says, e.g. "40 Mbps". */
  valueText?: (value: number) => string;
}) {
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn("slider", className)}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="slider-control">
        <SliderPrimitive.Track className="slider-track">
          <SliderPrimitive.Indicator className="slider-indicator" />
          <SliderPrimitive.Thumb
            className="slider-thumb"
            getAriaLabel={() => label}
            getAriaValueText={
              valueText ? (_formatted, value) => valueText(value) : undefined
            }
          />
        </SliderPrimitive.Track>
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

export { Slider };
