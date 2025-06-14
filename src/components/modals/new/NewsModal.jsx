import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Image, Type, FileText } from "lucide-react"

import { getColors } from "@/actions/personalization"
import { uploadImageRequest } from "@/actions/image-bucket.js"

import { FormField } from "@/components/form/FormField"
import { TextInput } from "@/components/form/TextInput"
import { TextArea } from "@/components/form/TextArea"
import { Select } from "@/components/form/Select"
import { newsSchema } from "@/components/modals/new/new.schema.js"
import { NewsModalHeader } from "@/components/modals/new/NewsModalHeader.jsx"
import { ErrorMessage } from "@/components/utils/ErrorMessage.jsx"
import { ImageUpload } from "@/components/utils/ImageUpload.jsx"
import { ActionButtons } from "@/components/modals/ActionButtons.jsx"
import { Plus } from "lucide-react";

export function AddNewsModal({ onClose, defaultValues, onSubmit }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(defaultValues?.img ?? null)
  const [isUploading, setIsUploading] = useState(false)
  const [theme, setTheme] = useState({ colors: {} })

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm({
    resolver: zodResolver(newsSchema),
    defaultValues: defaultValues ?? {
      titulo: "",
      contenido: "",
      img: "",
      tipo: "general",
    },
  })

  const submit = async (data) => {
    try {
      clearErrors()
      await onSubmit(data)
      onClose()
    } catch (error) {
      setError("root", {
        type: "server",
        message: "Failed to process news. Please try again.",
      })
      console.error("Error al procesar la noticia:", error)
    }
  }

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const [error, colors] = await getColors()
        if (error) {
          console.error("Error fetching colors:", error)
          return
        }
        const formattedColors = Object.fromEntries(
          colors.map((color) => [color.nombre, color.hex])
        )
        setTheme((prevTheme) => ({
          ...prevTheme,
          colors: formattedColors,
        }))
      } catch (error) {
        console.error("Error fetching colors:", error)
      }
    }

    fetchColors()
  }, [])

  const handleFileUpload = async (file) => {
    const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

    if (file.size > MAX_FILE_SIZE) {
      setError("img", {
        type: "fileSize",
        message: "File size must be less than 10MB",
      })
      return
    }

    setIsUploading(true)
    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    clearErrors("img")

    try {
      const [error, response] = await uploadImageRequest({ file })

      if (error) {
        throw new Error(error.message || "Error uploading image")
      }

      setValue("img", response.publicUrl)
    } catch (error) {
      setError("img", {
        type: "upload",
        message: error.message || "Error uploading image",
      })
      handleRemoveFile()
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setValue("img", "")
    clearErrors("img")
  }

  const defaultTheme = {
    Background: "#fff8f0",
    Primary: "#fc5000",
    Secondary: "#e4e4e4",
    Tertiary: "#5f5f5f",
    Accent: "#505050",
  }

  const currentTheme = {
    colors: { ...defaultTheme, ...theme.colors }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(95, 95, 95, 0.5)" }}
    >
      <div
        className="rounded-2xl w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: currentTheme.colors.Background }}
      >
        <NewsModalHeader onClose={onClose} theme={currentTheme}/>

        <div className="p-6">
          <ErrorMessage error={errors.root} theme={currentTheme}/>

          <form onSubmit={handleSubmit(submit)} className="space-y-6">
            <FormField
              label="Title"
              error={errors.titulo}
              theme={currentTheme}
              icon={Type}
              required
            >
              <Controller
                name="titulo"
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    placeholder="Enter news title"
                    error={errors.titulo}
                    theme={currentTheme}
                  />
                )}
              />
            </FormField>

            <FormField
              label="Content"
              error={errors.contenido}
              theme={currentTheme}
              icon={FileText}
              required
            >
              <Controller
                name="contenido"
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    placeholder="Write your news content..."
                    error={errors.contenido}
                    theme={currentTheme}
                    rows={6}
                  />
                )}
              />
            </FormField>

            <FormField
              label="News Image"
              error={errors.img}
              theme={currentTheme}
              icon={Image}
              required
            >
              <ImageUpload
                onFileUpload={handleFileUpload}
                onRemoveFile={handleRemoveFile}
                selectedFile={selectedFile}
                previewUrl={previewUrl}
                isUploading={isUploading}
                error={errors.img}
                theme={currentTheme}
              />
            </FormField>

            <FormField
              label="News Type"
              error={errors.tipo}
              theme={currentTheme}
              required
            >
              <Controller
                name="tipo"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    error={errors.tipo}
                    theme={currentTheme}
                  >
                    <option value="general">General</option>
                    <option value="evento">Event</option>
                    <option value="noticia">News</option>
                  </Select>
                )}
              />
            </FormField>

            <ActionButtons
              onCancel={onClose}
              isSubmitting={isSubmitting}
              isUploading={isUploading}
              theme={currentTheme}
              submitText="Create News"
              submittingText="Creating..."
              icon={Plus}
            />
          </form>
        </div>
      </div>
    </div>
  )
}