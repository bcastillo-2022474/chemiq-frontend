// components/ImageUpload.jsx
import { useState, useRef } from "react"
import { X, ImageIcon } from "lucide-react"
import { Loader } from "lucide-react";

export function ImageUpload({
  onFileUpload,
  onRemoveFile,
  selectedFile,
  previewUrl,
  isUploading,
  error,
  theme
}) {
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const isDragEnterOrOver = e.type === "dragenter" || e.type === "dragover"
    setDragActive(isDragEnterOrOver)
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer?.files
    const file = files?.[0]

    if (file?.type.startsWith("image/")) {
      await onFileUpload(file)
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      await onFileUpload(file)
    }
  }

  const getBorderColor = () => {
    if (error) return "#ef4444"
    if (dragActive) return theme.colors.Primary
    if (selectedFile) return "#10b981"
    return `${theme.colors.Tertiary}40`
  }

  const getBackgroundColor = () => {
    if (dragActive) return `${theme.colors.Primary}10`
    if (selectedFile) return "#10b98110"
    return "transparent"
  }

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${
        dragActive ? "scale-[1.02]" : ""
      }`}
      style={{
        borderColor: getBorderColor(),
        backgroundColor: getBackgroundColor(),
      }}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {previewUrl ? (
        <ImagePreview
          previewUrl={previewUrl}
          selectedFile={selectedFile}
          isUploading={isUploading}
          onRemove={onRemoveFile}
          theme={theme}
        />
      ) : (
        <DropZone
          theme={theme}
          onBrowseClick={() => fileInputRef.current?.click()}
        />
      )}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  )
}

function ImagePreview({ previewUrl, selectedFile, isUploading, onRemove, theme }) {
  return (
    <div className="relative p-4">
      <div className="relative rounded-lg overflow-hidden">
        <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover" />
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Loader
              className="animate-spin h-8 w-8"
              style={{ color: theme.colors.Secondary }}
            />
          </div>
        )}
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="mt-3 text-sm" style={{ color: theme.colors.Tertiary }}>
        <span className="font-medium">{selectedFile?.name}</span>
        <span className="ml-2 opacity-60">
          ({Math.round((selectedFile?.size || 0) / 1024)} KB)
        </span>
      </div>
    </div>
  )
}

function DropZone({ theme, onBrowseClick }) {
  return (
    <div className="p-8 text-center">
      <div
        className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{ backgroundColor: `${theme.colors.Tertiary}20` }}
      >
        <ImageIcon className="w-8 h-8" style={{ color: theme.colors.Tertiary }} />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium" style={{ color: theme.colors.Accent }}>
          Drop your image here, or{" "}
          <button
            type="button"
            className="font-semibold underline hover:no-underline transition-all"
            style={{ color: theme.colors.Primary }}
            onClick={onBrowseClick}
          >
            browse
          </button>
        </p>
        <p className="text-xs opacity-60" style={{ color: theme.colors.Tertiary }}>
          PNG, JPG, GIF up to 10MB
        </p>
      </div>
    </div>
  )
}