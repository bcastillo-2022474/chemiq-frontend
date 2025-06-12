import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Youtube, User } from "lucide-react"

import { useUsers } from "@/hooks/useUsers"
import { getColors } from "@/actions/personalization"
import { uploadImageRequest } from "@/actions/image-bucket.js"

import { FormField } from "@/components/form/FormField"
import { TextInput } from "@/components/form/TextInput"
import { TextArea } from "@/components/form/TextArea"
import { Select } from "@/components/form/Select"
import { projectSchema } from "@/components/modals/project/project.schema.js";
import { ProjectModalHeader } from "@/components/modals/project/ProjectModalHeader.jsx";
import { ErrorMessage } from "@/components/utils/ErrorMessage.jsx";
import { ImageUpload } from "@/components/utils/ImageUpload.jsx";
import { ActionButtons } from "@/components/modals/project/ActionButtons.jsx";

export function AddProjectModal({ onClose, defaultValues, onSubmit }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(defaultValues?.img ?? null)
  const [isUploading, setIsUploading] = useState(false)
  const [theme, setTheme] = useState({ colors: {} })
  const { users, loading: usersLoading, error: usersError } = useUsers()

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: defaultValues ?? {
      nombre: "",
      informacion: "",
      img: "",
      youtube: "",
      dueno_id: "",
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
        message: "Failed to process project. Please try again.",
      })
      console.error("Error al procesar el proyecto:", error)
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
        <ProjectModalHeader onClose={onClose} theme={currentTheme}/>

        <div className="p-6">
          <ErrorMessage error={errors.root} theme={currentTheme}/>

          <form onSubmit={handleSubmit(submit)} className="space-y-6">
            <FormField
              label="Project Name"
              error={errors.nombre}
              theme={currentTheme}
              required
            >
              <Controller
                name="nombre"
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    placeholder="Enter your project name"
                    error={errors.nombre}
                    theme={currentTheme}
                  />
                )}
              />
            </FormField>

            <FormField
              label="Project Information"
              error={errors.informacion}
              theme={currentTheme}
              required
            >
              <Controller
                name="informacion"
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    placeholder="Describe your project in detail..."
                    error={errors.informacion}
                    theme={currentTheme}
                    rows={4}
                  />
                )}
              />
            </FormField>

            <FormField
              label="Project Image"
              error={errors.img}
              theme={currentTheme}
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
              label="YouTube Link"
              error={errors.youtube}
              theme={currentTheme}
              icon={Youtube}
            >
              <Controller
                name="youtube"
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    error={errors.youtube}
                    theme={currentTheme}
                  />
                )}
              />
            </FormField>

            <FormField
              label="Project Owner"
              error={errors.dueno_id}
              theme={currentTheme}
              icon={User}
              required
            >
              <Controller
                name="dueno_id"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    error={errors.dueno_id}
                    theme={currentTheme}
                  >
                    <option value="">Select an owner</option>
                    {usersLoading ? (
                      <option disabled>Loading users...</option>
                    ) : usersError ? (
                      <option disabled>Error loading users</option>
                    ) : (
                      users.map((usuario) => (
                        <option key={usuario.carne} value={usuario.carne}>
                          {usuario.nombre} ({usuario.carne})
                        </option>
                      ))
                    )}
                  </Select>
                )}
              />
            </FormField>

            <ActionButtons
              onCancel={onClose}
              isSubmitting={isSubmitting}
              isUploading={isUploading}
              theme={currentTheme}
            />
          </form>
        </div>
      </div>
    </div>
  )
}