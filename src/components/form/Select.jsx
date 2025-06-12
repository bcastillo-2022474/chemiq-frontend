// components/form/Select.jsx
import { forwardRef } from "react"

const Select = forwardRef(({
  error,
  theme,
  children,
  className = "",
  onFocus: customOnFocus,
  onBlur: customOnBlur,
  ...props
}, ref) => {
  const baseStyles = {
    borderColor: error ? "#ef4444" : `${theme.colors.Tertiary}40`,
    backgroundColor: theme.colors.Background,
    color: theme.colors.Tertiary,
  }

  const focusStyles = {
    borderColor: theme.colors.Primary,
    boxShadow: `0 0 0 4px ${theme.colors.Primary}20`,
  }

  const blurStyles = {
    borderColor: error ? "#ef4444" : `${theme.colors.Tertiary}40`,
    boxShadow: "none",
  }

  const handleFocus = (e) => {
    Object.assign(e.target.style, focusStyles)
    customOnFocus?.(e)
  }

  const handleBlur = (e) => {
    Object.assign(e.target.style, blurStyles)
    customOnBlur?.(e)
  }

  return (
    <select
      ref={ref}
      className={`w-full rounded-xl border-2 px-4 py-3 text-sm transition-all duration-200 focus:outline-none ${className}`}
      style={baseStyles}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    >
      {children}
    </select>
  )
})

Select.displayName = "Select"
export { Select }