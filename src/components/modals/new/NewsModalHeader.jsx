import { X, Newspaper } from "lucide-react"

export function NewsModalHeader({ onClose, theme }) {
  return (
    <div
      className="flex items-center justify-between p-6 border-b"
      style={{ borderColor: theme.colors.Secondary }}
    >
      <div className="flex items-center space-x-3">
        <Newspaper
          className="h-6 w-6"
          style={{ color: theme.colors.Primary }}
        />
        <h2
          className="text-xl font-semibold"
          style={{ color: theme.colors.Tertiary }}
        >
          Add News
        </h2>
      </div>
      <button
        onClick={onClose}
        className="p-2 rounded-full hover:bg-opacity-10 transition-all"
        style={{
          color: theme.colors.Tertiary,
          backgroundColor: 'transparent'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = `${theme.colors.Tertiary}10`}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  )
}