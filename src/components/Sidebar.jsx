"use client"

import { Link, useLocation, useNavigate } from "react-router-dom"
import { Home, Podcast, Newspaper, Beaker, User, ChevronDown, LogOut, FlaskRound } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/auth.jsx"
import { useState, useEffect, useRef } from "react"
import { updateUserRequest } from "@/actions/users.js"
import { uploadImageRequest } from "@/actions/image-bucket.js"
import { getColors } from "@/actions/personalization"

const navItems = [
  { name: "Inicio", component: "", icon: Home },
  { name: "Podcast", component: "podcast", icon: Podcast },
  { name: "Noticias", component: "news", icon: Newspaper },
  { name: "Proyectos", component: "project", icon: Beaker },
]

export function Sidebar() {
  const [theme, setTheme] = useState({
    colors: {}, // Inicialmente vacío
  })

  const fetchColors = async () => {
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
    console.log("Fetched colors:", formattedColors)
  }

  useEffect(() => {
    fetchColors()
  }, [])

  const navigate = useNavigate()
  const { user } = useAuth()
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

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login")
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setErrorMessage("")
  }

  const handleImageClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      console.log("Archivo seleccionado:", e.target.files[0].name)
      const [error, response] = await uploadImageRequest({ file: e.target.files[0] })
      if (error) {
        setErrorMessage(error.message || "Error al subir la imagen")
        return
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
        ...dataToSend,
      },
    })
    if (error) {
      setErrorMessage(error.message || "Error al actualizar el perfil")
    }

    setIsModalOpen(false)
  }

  return (
    <>
      <aside
        className="flex flex-col h-screen w-16 md:w-64 transition-all duration-300"
        style={{
          backgroundColor: theme.colors.Tertiary || '#5f5f5f',
          color: theme.colors.Secondary || '#e4e4e4',
        }}
      >
        <div
          className="p-4 border-b flex items-center justify-center md:justify-start"
          style={{ borderColor: `${theme.colors.Secondary || '#e4e4e4'}1a` }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: theme.colors.Primary || '#fc5000' }}
          >
            <FlaskRound
              className="w-4 h-4"
              style={{ color: theme.colors.Secondary || '#e4e4e4' }}
            />
          </div>
          <h1
            className="ml-3 text-xl font-bold hidden md:block"
            style={{ color: theme.colors.Secondary || '#e4e4e4' }}
          >
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
                    isActive ? "font-medium" : ""
                  }`}
                  style={{
                    backgroundColor: isActive
                      ? theme.colors.Primary || '#fc5000'
                      : "transparent",
                    color: isActive
                      ? theme.colors.Secondary || '#e4e4e4'
                      : theme.colors.Secondary || '#e4e4e4',
                  }}
                  onMouseEnter={(e) =>
                    !isActive &&
                    (e.currentTarget.style.backgroundColor = `${theme.colors.Secondary || '#e4e4e4'}1a`)
                  }
                  onMouseLeave={(e) =>
                    !isActive && (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <item.icon
                    className="w-5 h-5"
                    style={{
                      color: isActive
                        ? theme.colors.Secondary || '#e4e4e4'
                        : theme.colors.Secondary || '#e4e4e4',
                    }}
                  />
                  <span className="ml-3 hidden md:block">{item.name}</span>
                </Link>
              )
            })}
          </ul>
        </nav>

        <div
          className="p-4 border-t"
          style={{ borderColor: `${theme.colors.Secondary || '#e4e4e4'}1a` }}
        >
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex items-center justify-center md:justify-start w-full p-2 rounded-lg transition-colors"
              style={{ color: theme.colors.Secondary || '#e4e4e4' }}
            >
              <div
                className="relative w-8 h-8 rounded-full flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: `${theme.colors.Primary || '#fc5000'}33` }}
              >
                {user.img ? (
                  <img
                    src={user.img || "/placeholder.svg"}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User
                    className="w-4 h-4"
                    style={{ color: theme.colors.Secondary || '#e4e4e4' }}
                  />
                )}
              </div>
              <span className="ml-3 hidden md:block truncate">{user.nombre}</span>
              <ChevronDown size={16} className="ml-auto hidden md:block" />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-56"
              style={{
                backgroundColor: theme.colors.Background || '#fff8f0',
                borderColor: `${theme.colors.Primary || '#fc5000'}33`,
                color: theme.colors.Accent || '#505050',
              }}
              align="end"
            >
              <DropdownMenuItem
                className="cursor-pointer"
                style={{ color: theme.colors.Accent || '#505050' }}
                onClick={() => setIsModalOpen(true)}
              >
                <User className="mr-2 h-4 w-4" />
                <span>Mi Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator
                style={{ backgroundColor: `${theme.colors.Secondary || '#e4e4e4'}1a` }}
              />
              <DropdownMenuItem
                className="cursor-pointer"
                style={{ color: theme.colors.Primary || '#fc5000' }}
                onClick={handleLogout}
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
          className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center transition-all duration-300"
          style={{ backgroundColor: `${theme.colors.Tertiary || '#5f5f5f'}b3` }}
        >
          <div
            className="w-full max-w-2xl rounded-xl shadow-lg p-6 m-4 max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: theme.colors.Background || '#fff8f0',
              color: theme.colors.Accent || '#505050',
              borderColor: theme.colors.Primary || '#fc5000',
              boxShadow: `0 4px 6px -1px ${theme.colors.Primary || '#fc5000'}1a`,
            }}
          >
            <div
              className="flex justify-between items-center mb-6 border-b pb-4"
              style={{ borderColor: `${theme.colors.Secondary || '#e4e4e4'}1a` }}
            >
              <h2
                className="text-2xl font-bold"
                style={{ color: theme.colors.Primary || '#fc5000' }}
              >
                Editar Perfil
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{
                  color: theme.colors.Accent || '#505050',
                  backgroundColor: `${theme.colors.Secondary || '#e4e4e4'}0d`,
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
                      style={{ color: `${theme.colors.Accent || '#505050'}cc` }}
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
                        backgroundColor: theme.colors.Background || '#fff8f0',
                        borderColor: `${theme.colors.Primary || '#fc5000'}4d`,
                        color: theme.colors.Accent || '#505050',
                        focusBorderColor: theme.colors.Primary || '#fc5000',
                        focusRingColor: theme.colors.Primary || '#fc5000',
                      }}
                      required
                    />
                  </div>

                  <div className="mb-5">
                    <label
                      className="block mb-2 text-sm font-medium"
                      style={{ color: `${theme.colors.Accent || '#505050'}cc` }}
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
                        backgroundColor: theme.colors.Background || '#fff8f0',
                        borderColor: `${theme.colors.Primary || '#fc5000'}4d`,
                        color: theme.colors.Accent || '#505050',
                        focusBorderColor: theme.colors.Primary || '#fc5000',
                        focusRingColor: theme.colors.Primary || '#fc5000',
                      }}
                      required
                    />
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-start">
                  <div
                    className="relative w-32 h-32 rounded-full flex items-center justify-center overflow-hidden border-2 mb-3 cursor-pointer group"
                    style={{
                      backgroundColor: `${theme.colors.Primary || '#fc5000'}33`,
                      borderColor: `${theme.colors.Primary || '#fc5000'}4d`,
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
                          style={{
                            backgroundColor: `${theme.colors.Tertiary || '#5f5f5f'}b3`,
                          }}
                        >
                          <div
                            className="text-sm font-medium text-center px-2"
                            style={{ color: theme.colors.Primary || '#fc5000' }}
                          >
                            Cambiar imagen
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <User
                          className="w-12 h-12"
                          style={{ color: theme.colors.Accent || '#505050' }}
                        />
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200"
                          style={{
                            backgroundColor: `${theme.colors.Tertiary || '#5f5f5f'}b3`,
                          }}
                        >
                          <div
                            className="text-sm font-medium text-center px-2"
                            style={{ color: theme.colors.Primary || '#fc5000' }}
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
                      style={{ color: `${theme.colors.Accent || '#505050'}cc` }}
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
                        backgroundColor: theme.colors.Background || '#fff8f0',
                        borderColor: `${theme.colors.Primary || '#fc5000'}4d`,
                        color: theme.colors.Accent || '#505050',
                        focusBorderColor: theme.colors.Primary || '#fc5000',
                        focusRingColor: theme.colors.Primary || '#fc5000',
                      }}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              </div>

              <div
                className="border-t pt-5 mt-5"
                style={{ borderColor: `${theme.colors.Secondary || '#e4e4e4'}1a` }}
              >
                <h3
                  className="text-lg font-medium mb-4"
                  style={{ color: theme.colors.Primary || '#fc5000' }}
                >
                  Cambiar Contraseña
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label
                      className="block mb-2 text-sm font-medium"
                      style={{ color: `${theme.colors.Accent || '#505050'}cc` }}
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
                        backgroundColor: theme.colors.Background || '#fff8f0',
                        borderColor: `${theme.colors.Primary || '#fc5000'}4d`,
                        color: theme.colors.Accent || '#505050',
                        focusBorderColor: theme.colors.Primary || '#fc5000',
                        focusRingColor: theme.colors.Primary || '#fc5000',
                      }}
                      placeholder="Mínimo 8 caracteres"
                    />
                  </div>

                  <div>
                    <label
                      className="block mb-2 text-sm font-medium"
                      style={{ color: `${theme.colors.Accent || '#505050'}cc` }}
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
                        backgroundColor: theme.colors.Background || '#fff8f0',
                        borderColor: `${theme.colors.Primary || '#fc5000'}4d`,
                        color: theme.colors.Accent || '#505050',
                        focusBorderColor: theme.colors.Primary || '#fc5000',
                        focusRingColor: theme.colors.Primary || '#fc5000',
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
                    backgroundColor: `#FF000019`,
                    borderColor: `#FF00004d`,
                    color: '#FF0000',
                  }}
                >
                  {errorMessage}
                </div>
              )}

              <div
                className="flex justify-end gap-4 pt-4 border-t mt-5"
                style={{ borderColor: `${theme.colors.Secondary || '#e4e4e4'}1a` }}
              >
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg transition-colors"
                  style={{
                    backgroundColor: `${theme.colors.Secondary || '#e4e4e4'}0d`,
                    color: theme.colors.Accent || '#505050',
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg font-medium transition-colors"
                  style={{
                    backgroundColor: theme.colors.Primary || '#fc5000',
                    color: theme.colors.Secondary || '#e4e4e4',
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