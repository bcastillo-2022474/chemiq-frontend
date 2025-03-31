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

const navItems = [
  { name: "Inicio", component: "", icon: Home },
  { name: "Podcast", component: "podcast", icon: Podcast },
  { name: "Noticias", component: "news", icon: Newspaper },
  { name: "Proyectos", component: "project", icon: Beaker },
]

export function Sidebar() {
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
  const [error, setError] = useState("")
  const fileInputRef = useRef(null)

  const isSectionSelected = navItems.some((item) => item.component === location.pathname.split("/")[2])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError("") // Clear error when user types
  }

  const handleImageClick = () => {
    fileInputRef.current.click()
  }

  // Esta función se implementará en el futuro
  const handleFileChange = (e) => {
    // Por ahora solo mostramos el nombre del archivo seleccionado en la consola
    // La implementación real se hará en el futuro
    if (e.target.files && e.target.files[0]) {
      console.log("Archivo seleccionado:", e.target.files[0].name)
      // Aquí iría la lógica para subir la imagen y actualizar formData.img
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Password validation
    if (formData.password || formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        setError("Las contraseñas no coinciden")
        return
      }
      if (formData.password.length < 8) {
        setError("La contraseña debe tener al menos 8 caracteres")
        return
      }
    }

    try {
      // Prepare data to send (only include password if it's being changed)
      const dataToSend = {
        nombre: formData.nombre,
        correo: formData.correo,
        img: formData.img,
      }
      if (formData.password) {
        dataToSend.password = formData.password
      }

      const response = await fetch(`${BASE_URL}/api/users/${user.carne}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Add any authentication headers if required by your auth context
        },
        body: JSON.stringify(dataToSend),
      })

      if (response.ok) {
        setIsModalOpen(false)
        setFormData((prev) => ({
          ...prev,
          password: "",
          confirmPassword: "",
        }))
        // You might want to add a success message here
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Error al actualizar el perfil")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      setError("Error al conectar con el servidor")
    }
  }

  return (
    <>
      <aside className="flex flex-col h-screen w-16 md:w-64 bg-[#0B2F33] text-[#FFF8F0] transition-all duration-300">
        <div className="p-4 border-b border-[#FFF8F0]/10 flex items-center justify-center md:justify-start">
          <div className="w-8 h-8 rounded-full bg-[#28BC98] flex items-center justify-center">
            <FlaskRound className="w-4 h-4 text-[#0B2F33]" />
          </div>
          <h1 className="ml-3 text-xl font-bold text-[#FFF8F0] hidden md:block">CHEMIQ</h1>
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
                    isActive ? "bg-[#28BC98] text-[#0B2F33]" : "hover:bg-[#28BC98]/10"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "" : "text-[#FFF8F0]"}`} />
                  <span className="ml-3 font-medium hidden md:block">{item.name}</span>
                </Link>
              )
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-[#FFF8F0]/10">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center justify-center md:justify-start w-full p-2 rounded-lg hover:bg-[#28BC98]/10 transition-colors">
              <div className="relative w-8 h-8 rounded-full bg-[#28BC98]/20 flex items-center justify-center overflow-hidden">
                {user.img ? (
                  <img src={user.img || "/placeholder.svg"} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-[#FFF8F0]" />
                )}
              </div>
              <span className="ml-3 hidden md:block truncate">{user.nombre}</span>
              <ChevronDown size={16} className="ml-auto hidden md:block" />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56 bg-[#0B2F33] border border-[#28BC98]/20 text-[#FFF8F0]" align="end">
              <DropdownMenuItem
                className="hover:bg-[#28BC98]/10 focus:bg-[#28BC98]/10 cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                <User className="mr-2 h-4 w-4" />
                <span>Mi Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#FFF8F0]/10" />
              <DropdownMenuItem
                className="text-[#7DE2A6] hover:bg-[#28BC98]/10 focus:bg-[#28BC98]/10 cursor-pointer"
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center transition-all duration-300">
          <div className="bg-[#0B2F33] text-[#FFF8F0] w-full max-w-2xl rounded-xl border border-[#28BC98]/20 shadow-lg shadow-[#28BC98]/10 p-6 m-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b border-[#FFF8F0]/10 pb-4">
              <h2 className="text-2xl font-bold text-[#28BC98]">Editar Perfil</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#FFF8F0] hover:text-[#28BC98] transition-colors w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#FFF8F0]/5"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex flex-col md:flex-row gap-5">
                <div className="flex-1">
                  <div className="mb-5">
                    <label className="block text-[#FFF8F0]/80 mb-2 text-sm font-medium">Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg bg-[#0B2F33] border border-[#28BC98]/30 focus:outline-none focus:border-[#28BC98] focus:ring-1 focus:ring-[#28BC98] transition-all"
                      required
                    />
                  </div>

                  <div className="mb-5">
                    <label className="block text-[#FFF8F0]/80 mb-2 text-sm font-medium">Correo</label>
                    <input
                      type="email"
                      name="correo"
                      value={formData.correo}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg bg-[#0B2F33] border border-[#28BC98]/30 focus:outline-none focus:border-[#28BC98] focus:ring-1 focus:ring-[#28BC98] transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-start">
                  <div
                    className="relative w-32 h-32 rounded-full bg-[#28BC98]/20 flex items-center justify-center overflow-hidden border-2 border-[#28BC98]/30 mb-3 cursor-pointer group"
                    onClick={handleImageClick}
                  >
                    {formData.img ? (
                      <>
                        <img
                          src={formData.img || "/placeholder.svg"}
                          alt="Avatar Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-[#0B2F33]/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                          <div className="text-[#28BC98] text-sm font-medium text-center px-2">Cambiar imagen</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <User className="w-12 h-12 text-[#FFF8F0]" />
                        <div className="absolute inset-0 bg-[#0B2F33]/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                          <div className="text-[#28BC98] text-sm font-medium text-center px-2">Subir imagen</div>
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
                    <label className="block text-[#FFF8F0]/80 mb-2 text-sm font-medium text-center">
                      URL de la imagen
                    </label>
                    <input
                      type="url"
                      name="img"
                      value={formData.img}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg bg-[#0B2F33] border border-[#28BC98]/30 focus:outline-none focus:border-[#28BC98] focus:ring-1 focus:ring-[#28BC98] transition-all"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-[#FFF8F0]/10 pt-5 mt-5">
                <h3 className="text-lg font-medium text-[#28BC98] mb-4">Cambiar Contraseña</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[#FFF8F0]/80 mb-2 text-sm font-medium">
                      Nueva contraseña (opcional)
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg bg-[#0B2F33] border border-[#28BC98]/30 focus:outline-none focus:border-[#28BC98] focus:ring-1 focus:ring-[#28BC98] transition-all"
                      placeholder="Mínimo 8 caracteres"
                    />
                  </div>

                  <div>
                    <label className="block text-[#FFF8F0]/80 mb-2 text-sm font-medium">
                      Confirmar nueva contraseña
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg bg-[#0B2F33] border border-[#28BC98]/30 focus:outline-none focus:border-[#28BC98] focus:ring-1 focus:ring-[#28BC98] transition-all"
                      placeholder="Repite la contraseña"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-4 pt-4 border-t border-[#FFF8F0]/10 mt-5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg bg-[#FFF8F0]/5 text-[#FFF8F0] hover:bg-[#FFF8F0]/10 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#28BC98] text-[#0B2F33] font-medium hover:bg-[#7DE2A6] transition-colors"
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

