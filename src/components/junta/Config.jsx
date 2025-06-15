"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth.jsx"
import { updateUserRequest } from "@/actions/users"
import { Camera, User, Mail, Lock, Save, Upload } from "lucide-react"
import Swal from "sweetalert2"

function Config() {
  const { user, verifyAuth } = useAuth()
  const [formData, setFormData] = useState({
    nombre: user?.nombre || "",
    correo: user?.correo || "",
    password: "",
    rol_id: user?.rol_id || "",
    img: user?.img || "",
  })
  const [loading, setLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState("")

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        correo: user.correo || "",
        password: "",
        rol_id: user.rol_id || "",
        img: user.img || "",
      })
      setPreviewImage(user.img || "")
    }
  }, [user])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (field === "img") {
      setPreviewImage(value)
    }
  }

  const handleSaveChanges = async () => {
    setLoading(true)
    const updatedData = { ...formData }
    if (!updatedData.password) delete updatedData.password

    const [error] = await updateUserRequest({ id: user.carne, user: updatedData })
    setLoading(false)

    if (error) {
      void Swal.fire({ icon: "error", title: "Error", text: "No se pudieron guardar los cambios." })
      return
    }

    await verifyAuth()
    void Swal.fire({ icon: "success", title: "Éxito", text: "Datos actualizados correctamente." })
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSaveChanges()
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const fakeUrl = URL.createObjectURL(file)
      setPreviewImage(fakeUrl)
      handleInputChange("img", fakeUrl)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Configuración de Perfil</h1>
          <p className="text-gray-600">Actualiza tu información personal y preferencias</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-12 text-center relative">
            <div className="relative inline-block">
              <img
                src={previewImage || "/placeholder.svg?height=120&width=120"}
                alt="Imagen de perfil"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
              />
              <label
                htmlFor="image-upload"
                className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <Camera className="h-4 w-4 text-gray-600" />
                <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
            <h2 className="text-2xl font-bold text-white mt-4">{formData.nombre || "Usuario"}</h2>
            <p className="text-blue-100">{formData.correo}</p>
          </div>

          {/* Form */}
          <div className="p-8 space-y-6">
            {/* Image URL Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Upload className="h-4 w-4" />
                URL de la imagen
              </label>
              <input
                type="text"
                value={formData.img}
                onChange={(e) => handleInputChange("img", e.target.value)}
                placeholder="https://ejemplo.com/imagen.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Name Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <User className="h-4 w-4" />
                Nombre completo
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => handleInputChange("nombre", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Mail className="h-4 w-4" />
                Correo electrónico
              </label>
              <input
                type="email"
                value={formData.correo}
                onChange={(e) => handleInputChange("correo", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Lock className="h-4 w-4" />
                Nueva contraseña
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Dejar en blanco para no cambiar"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                onKeyDown={handleKeyDown}
              />
              <p className="text-xs text-gray-500">Solo completa este campo si deseas cambiar tu contraseña actual</p>
            </div>

            {/* Save Button */}
            <div className="pt-6">
              <button
                onClick={handleSaveChanges}
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-medium text-white transition-all duration-300 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:scale-[1.02]"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">Los cambios se aplicarán inmediatamente después de guardar</p>
        </div>
      </div>
    </div>
  )
}

export default Config
