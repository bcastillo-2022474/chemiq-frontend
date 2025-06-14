import { Upload, Loader } from "lucide-react"

export function ActionButtons({
  onCancel,
  isSubmitting,
  isUploading,
  theme,
  submitText = "Submit",
  submittingText = "Submitting...",
  uploadingText = "Uploading...",
  icon: Icon = Upload
}) {
  const isDisabled = isSubmitting || isUploading

  const getButtonText = () => {
    if (isSubmitting) return submittingText
    if (isUploading) return uploadingText
    return submitText
  }

  const getButtonIcon = () => {
    if (isSubmitting || isUploading) {
      return (
        <Loader
          className="animate-spin h-8 w-8"
          style={{ color: theme.colors.Secondary }}
        />
      )
    }
    return <Icon className="w-4 h-4"/>
  }

  const handleCancelMouseEnter = (e) => {
    e.target.style.backgroundColor = `${theme.colors.Tertiary}10`
  }

  const handleCancelMouseLeave = (e) => {
    e.target.style.backgroundColor = "transparent"
  }

  const handleSubmitMouseEnter = (e) => {
    if (!isDisabled) {
      e.target.style.backgroundColor = theme.colors.Accent
    }
  }

  const handleSubmitMouseLeave = (e) => {
    if (!isDisabled) {
      e.target.style.backgroundColor = theme.colors.Primary
    }
  }

  return (
    <div className="flex gap-4 pt-6">
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 px-6 py-3 font-semibold rounded-xl border-2 transition-all duration-200 hover:scale-[1.02]"
        style={{
          borderColor: `${theme.colors.Tertiary}40`,
          color: theme.colors.Tertiary,
          backgroundColor: "transparent",
        }}
        onMouseEnter={handleCancelMouseEnter}
        onMouseLeave={handleCancelMouseLeave}
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isDisabled}
        className="flex-1 px-6 py-3 font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: theme.colors.Primary,
          color: theme.colors.Secondary,
        }}
        onMouseEnter={handleSubmitMouseEnter}
        onMouseLeave={handleSubmitMouseLeave}
      >
        {getButtonIcon()}
        {getButtonText()}
      </button>
    </div>
  )
}