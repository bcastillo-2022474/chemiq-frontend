// components/ErrorMessage.jsx
export function ErrorMessage({ error, theme }) {
  if (!error) return null

  return (
    <div
      className="mb-6 p-4 rounded-lg border-l-4 bg-red-50"
      style={{
        borderLeftColor: theme.colors.Primary,
        color: theme.colors.Primary,
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: theme.colors.Primary }}
        />
        <span className="text-sm font-medium">{error.message}</span>
      </div>
    </div>
  )
}