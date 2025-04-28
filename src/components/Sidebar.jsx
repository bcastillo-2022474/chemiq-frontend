"use client"

import { Link, useLocation } from "react-router-dom"
import { Home, Podcast, Newspaper, Beaker, User, ChevronDown, LogOut, FlaskRound } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/auth.jsx"
import { useState, useRef } from "react"
import { BASE_URL } from "@/lib/constants.js"
import { useUsers } from "@/hooks/useUsers.js";
import { updateUserRequest } from "@/actions/users.js";
import { uploadImageRequest } from "@/actions/image-bucket.js";

const navItems = [
  { name: "Inicio", component: "", icon: Home },
  { name: "Podcast", component: "podcast", icon: Podcast },
  { name: "Noticias", component: "news", icon: Newspaper },
  { name: "Proyectos", component: "project", icon: Beaker },
]

export function Sidebar({
  colors = {
    background: "#0B2F33",
    text: "#FFF8F0",
    textHover: "#7DE2A6",
    activeBackground: "#28BC98",
    activeText: "#0B2F33",
    border: "#FFF8F0",
    iconBackground: "#28BC98",
    iconText: "#0B2F33",
    modalBackground: "#0B2F33",
    modalText: "#FFF8F0",
    modalBorder: "#28BC98",
    modalHeaderText: "#28BC98",
    modalButtonBackground: "#28BC98",
    modalButtonText: "#0B2F33",
    modalButtonHover: "#7DE2A6",
    modalCancelButtonBackground: "#FFF8F0",
    modalCancelButtonText: "#FFF8F0",
    modalCancelButtonHover: "#FFF8F0",
    errorBackground: "rgba(255, 0, 0, 0.1)",
    errorBorder: "rgba(255, 0, 0, 0.3)",
    errorText: "#FF0000",
  },
}) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    nombre: user.nombre || "",
    correo: user.correo || "",
    img: user.img || "",
    password: "",
    confirmPassword: "",
  })
  const [errorMessage, setErrorMessage] = useState("")
  const fileInputRef = useRef(null)

  const isSectionSelected = navItems.some((item) => item.component === location.pathname.split("/")[2])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setErrorMessage("") // Clear errorMessage when user types
  }

  const handleImageClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      console.log("Archivo seleccionado:", e.target.files[0].name)
      const [error, response] = await uploadImageRequest({ file: e.target.files[0] })

      if (error) {
        setErrorMessage(error.message || "Error al subir la imagen");
        return;
      }
      setFormData({
        ...formData,
        img: response.publicUrl,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password || formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        setErrorMessage("Las contraseñas no coinciden")
        return
      }
      if (formData.password.length < 8) {
        setErrorMessage("La contraseña debe tener al menos 8 caracteres")
        return
      }
    }

    const dataToSend = {
      nombre: formData.nombre,
      correo: formData.correo,
      img: formData.img,
    }

    if (formData.password) {
      dataToSend.password = formData.password
    }

    const [error] = await updateUserRequest({
      id: user.carne,
      user: {
        ...user,
        ...dataToSend
      },
    })
    if (error) {
      setErrorMessage(error.message || "Error al actualizar el perfil");
    }

    setIsModalOpen(false)
  }

  return (
    <>
      <aside
        className="flex flex-col h-screen w-16 md:w-64 transition-all duration-300"
        style={{ backgroundColor: colors.background, color: colors.text }}
      >
        <div
          className="p-4 border-b flex items-center justify-center md:justify-start"
          style={{ borderColor: `${colors.border}/10` }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.iconBackground }}
          >
            <FlaskRound className="w-4 h-4" style={{ color: colors.iconText }} />
          </div>
          <h1 className="ml-3 text-xl font-bold hidden md:block" style={{ color: colors.text }}>
            CHEMIQ
          </h1>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              const isActive = isSectionSelected
                ? item.component === location.pathname.split("/")[2]
                : item.component === ""

              return (
                <Link
                  to={item.component && `./${item.component}`}
                  key={item.name}
                  className={`flex items-center justify-center md:justify-start w-full p-2 rounded-lg transition-all duration-200 ${
                    isActive ? "font-medium" : "hover:bg-opacity-10"
                  }`}
                  style={{
                    backgroundColor: isActive ? colors.activeBackground : "transparent",
                    color: isActive ? colors.activeText : colors.text,
                  }}
                >
                  <item.icon
                    className="w-5 h-5"
                    style={{ color: isActive ? colors.activeText : colors.text }}
                  />
                  <span className="ml-3 hidden md:block">{item.name}</span>
                </Link>
              )
            })}
          </ul>
        </nav>

        <div
          className="p-4 border-t"
          style={{ borderColor: `${colors.border}/10` }}
        >
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex items-center justify-center md:justify-start w-full p-2 rounded-lg transition-colors"
              style={{ color: colors.text }}
            >
              <div
                className="relative w-8 h-8 rounded-full flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: `${colors.iconBackground}/20` }}
              >
                {user.img ? (
                  <img src={user.img || "/placeholder.svg"} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4" style={{ color: colors.text }} />
                )}
              </div>
              <span className="ml-3 hidden md:block truncate">{user.nombre}</span>
              <ChevronDown size={16} className="ml-auto hidden md:block" />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-56"
              style={{
                backgroundColor: colors.modalBackground,
                borderColor: `${colors.modalBorder}/20`,
                color: colors.modalText,
              }}
              align="end"
            >
              <DropdownMenuItem
                className="cursor-pointer"
                style={{ color: colors.text }}
                onClick={() => setIsModalOpen(true)}
              >
                <User className="mr-2 h-4 w-4" />
                <span>Mi Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator style={{ backgroundColor: `${colors.border}/10` }} />
              <DropdownMenuItem
                className="cursor-pointer"
                style={{ color: colors.textHover }}
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center transition-all duration-300"
        >
          <div
            className="w-full max-w-2xl rounded-xl shadow-lg p-6 m-4 max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: colors.modalBackground,
              color: colors.modalText,
              borderColor: colors.modalBorder,
              boxShadow: `0 4px 6px -1px ${colors.modalBorder}/10`,
            }}
          >
            <div
              className="flex justify-between items-center mb-6 border-b pb-4"
              style={{ borderColor: `${colors.border}/10` }}
            >
              <h2 className="text-2xl font-bold" style={{ color: colors.modalHeaderText }}>
                Editar Perfil
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{
                  color: colors.modalText,
                  backgroundColor: `${colors.modalCancelButtonBackground}/5`,
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex flex-col md:flex-row gap-5">
                <div className="flex-1">
                  <div className="mb-5">
                    <label
                      className="block mb-2 text-sm font-medium"
                      style={{ color: `${colors.text}/80` }}
                    >
                      Nombre
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg focus:outline-none focus:ring-1 transition-all"
                      style={{
                        backgroundColor: colors.modalBackground,
                        borderColor: `${colors.modalBorder}/30`,
                        color: colors.modalText,
                        focusBorderColor: colors.modalBorder,
                        focusRingColor: colors.modalBorder,
                      }}
                      required
                    />
                  </div>

                  <div className="mb-5">
                    <label
                      className="block mb-2 text-sm font-medium"
                      style={{ color: `${colors.text}/80` }}
                    >
                      Correo
                    </label>
                    <input
                      type="email"
                      name="correo"
                      value={formData.correo}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg focus:outline-none focus:ring-1 transition-all"
                      style={{
                        backgroundColor: colors.modalBackground,
                        borderColor: `${colors.modalBorder}/30`,
                        color: colors.modalText,
                        focusBorderColor: colors.modalBorder,
                        focusRingColor: colors.modalBorder,
                      }}
                      required
                    />
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-start">
                  <div
                    className="relative w-32 h-32 rounded-full flex items-center justify-center overflow-hidden border-2 mb-3 cursor-pointer group"
                    style={{
                      backgroundColor: `${colors.iconBackground}/20`,
                      borderColor: `${colors.modalBorder}/30`,
                    }}
                    onClick={handleImageClick}
                  >
                    {formData.img ? (
                      <>
                        <img
                          src={formData.img || "/placeholder.svg"}
                          alt="Avatar Preview"
                          className="w-full h-full object-cover"
                        />
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200"
                          style={{ backgroundColor: `${colors.modalBackground}/70` }}
                        >
                          <div
                            className="text-sm font-medium text-center px-2"
                            style={{ color: colors.modalHeaderText }}
                          >
                            Cambiar imagen
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <User className="w-12 h-12" style={{ color: colors.modalText }} />
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200"
                          style={{ backgroundColor: `${colors.modalBackground}/70` }}
                        >
                          <div
                            className="text-sm font-medium text-center px-2"
                            style={{ color: colors.modalHeaderText }}
                          >
                            Subir imagen
                          </div>
                        </div>
                      </>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  <div className="w-full">
                    <label
                      className="block mb-2 text-sm font-medium text-center"
                      style={{ color: `${colors.text}/80` }}
                    >
                      URL de la imagen
                    </label>
                    <input
                      type="url"
                      name="img"
                      value={formData.img}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg focus:outline-none focus:ring-1 transition-all"
                      style={{
                        backgroundColor: colors.modalBackground,
                        borderColor: `${colors.modalBorder}/30`,
                        color: colors.modalText,
                        focusBorderColor: colors.modalBorder,
                        focusRingColor: colors.modalBorder,
                      }}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-5 mt-5" style={{ borderColor: `${colors.border}/10` }}>
                <h3
                  className="text-lg font-medium mb-4"
                  style={{ color: colors.modalHeaderText }}
                >
                  Cambiar Contraseña
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label
                      className="block mb-2 text-sm font-medium"
                      style={{ color: `${colors.text}/80` }}
                    >
                      Nueva contraseña (opcional)
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg focus:outline-none focus:ring-1 transition-all"
                      style={{
                        backgroundColor: colors.modalBackground,
                        borderColor: `${colors.modalBorder}/30`,
                        color: colors.modalText,
                        focusBorderColor: colors.modalBorder,
                        focusRingColor: colors.modalBorder,
                      }}
                      placeholder="Mínimo 8 caracteres"
                    />
                  </div>

                  <div>
                    <label
                      className="block mb-2 text-sm font-medium"
                      style={{ color: `${colors.text}/80` }}
                    >
                      Confirmar nueva contraseña
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg focus:outline-none focus:ring-1 transition-all"
                      style={{
                        backgroundColor: colors.modalBackground,
                        borderColor: `${colors.modalBorder}/30`,
                        color: colors.modalText,
                        focusBorderColor: colors.modalBorder,
                        focusRingColor: colors.modalBorder,
                      }}
                      placeholder="Repite la contraseña"
                    />
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div
                  className="text-sm p-3 rounded-lg"
                  style={{
                    backgroundColor: colors.errorBackground,
                    borderColor: colors.errorBorder,
                    color: colors.errorText,
                  }}
                >
                  {errorMessage}
                </div>
              )}

              <div className="flex justify-end gap-4 pt-4 border-t mt-5" style={{ borderColor: `${colors.border}/10` }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg transition-colors"
                  style={{
                    backgroundColor: `${colors.modalCancelButtonBackground}/5`,
                    color: colors.modalCancelButtonText,
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg font-medium transition-colors"
                  style={{
                    backgroundColor: colors.modalButtonBackground,
                    color: colors.modalButtonText,
                  }}
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

