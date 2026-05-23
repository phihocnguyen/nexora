import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@/lib/utils"

interface InputProps extends InputPrimitive.Props {
  label?: string
  suffix?: string
  prefix?: string
  error?: string
  wrapperClassName?: string
}

function Input({ label, suffix, prefix, error, wrapperClassName, className, ...props }: InputProps) {
  return (
    <div className={cn("flex flex-col gap-1", wrapperClassName)}>
      {label && <label className="text-xs text-muted-foreground">{label}</label>}
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-muted-foreground text-sm pointer-events-none z-10">
            {prefix}
          </span>
        )}
        <InputPrimitive
          className={cn(
            "w-full rounded-md border border-input bg-input/30 px-3 py-2 text-sm text-foreground",
            "placeholder:text-muted-foreground/60 outline-none transition-colors",
            "focus:border-ring focus:ring-2 focus:ring-ring/20",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "invalid:border-destructive",
            prefix && "pl-8",
            suffix && "pr-14",
            error && "border-destructive focus:ring-destructive/20",
            className,
          )}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3 text-muted-foreground text-xs pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

export { Input }
