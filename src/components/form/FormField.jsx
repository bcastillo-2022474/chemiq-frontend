// components/form/FormField.jsx
import { forwardRef } from "react"

const FormField = forwardRef(({
  label,
  error,
  children,
  icon: Icon,
  theme,
  required = false
}, ref) => {
  return (
    <div ref={ref} className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-semibold" style={{ color: theme.colors.Accent }}>
        {Icon && <Icon className="w-4 h-4" style={{ color: theme.colors.Tertiary }} />}
        {!Icon && (
          <div
            className="w-1 h-4 rounded-full"
            style={{ backgroundColor: theme.colors.Primary }}
          />
        )}
        {label}
        {required && <span style={{ color: theme.colors.Primary }}>*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  )
})

FormField.displayName = "FormField"
export { FormField }