// components/form/TextArea.jsx
import { forwardRef } from "react"

const TextArea = forwardRef(({
  error,
  theme,
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
    <textarea
      ref={ref}
      className={`w-full rounded-xl border-2 px-4 py-3 text-sm transition-all duration-200 focus:outline-none resize-none ${className}`}
      style={baseStyles}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    />
  )
})

TextArea.displayName = "TextArea"
export { TextArea }