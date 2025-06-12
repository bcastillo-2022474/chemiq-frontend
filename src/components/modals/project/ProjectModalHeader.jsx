import { X, FolderPlus } from "lucide-react"

export function ProjectModalHeader({ onClose, theme }) {
  const handleMouseEnter = (e) => {
    e.target.style.backgroundColor = `${theme.colors.Tertiary}20`
  }

  const handleMouseLeave = (e) => {
    e.target.style.backgroundColor = "transparent"
  }

  return (
    <div
      className="flex items-center justify-between p-6 border-b border-opacity-20"
      style={{ borderColor: theme.colors.Tertiary }}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg" style={{ backgroundColor: theme.colors.Primary }}>
          <FolderPlus className="w-5 h-5" style={{ color: theme.colors.Secondary }} />
        </div>
        <h2 className="text-2xl font-bold" style={{ color: theme.colors.Accent }}>
          Add New Project
        </h2>
      </div>
      <button
        onClick={onClose}
        className="p-2 rounded-lg transition-all duration-200"
        style={{
          color: theme.colors.Tertiary,
          backgroundColor: "transparent",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  )
}