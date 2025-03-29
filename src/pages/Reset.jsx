"use client"

import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Swal from "sweetalert2"
import { resetPasswordRequest } from "@/actions/users"
import { Check, X, LoaderCircle, Lock } from "lucide-react"

const Button = ({ children, className, variant, ...props }) => (
  <button
    className={`px-4 py-2 rounded ${className} ${variant === "outline" ? "border border-current" : ""}`}
    {...props}
  >
    {children}
  </button>
)

const Reset = () => {
  console.log("Reset.jsx")
  const { token } = useParams()
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState("idle")
  const navigate = useNavigate()

  // Para la animación
  const isVisible = true

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      void Swal.fire("Error", "Las contraseñas no coinciden", "error")
      return
    }

    if (status !== "idle") return
    setStatus("loading")

    try {
      const [error, successMessage] = await resetPasswordRequest({
        password: newPassword,
        token,
      })

      if (error) {
        setStatus("error")
        setMessage(error.message)
        void Swal.fire("Error", error.message, "error")
        setTimeout(() => {
          setStatus("idle")
        }, 3000)
        return
      }

      setStatus("success")
      setMessage(successMessage || "Contraseña restablecida con éxito")
      void Swal.fire("¡Éxito!", "Tu contraseña ha sido restablecida correctamente", "success")

      // Redireccionar después de 3 segundos
      setTimeout(() => {
        navigate("/login")
      }, 3000)
    } catch (error) {
      setStatus("error")
      setMessage("Ocurrió un error al restablecer la contraseña")
      void Swal.fire("Error", "Ocurrió un error al restablecer la contraseña", "error")
      setTimeout(() => {
        setStatus("idle")
      }, 3000)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div
        className={`hidden lg:block lg:w-1/2 relative overflow-hidden transition-all duration-1000 ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <img
          src="https://res.cloudinary.com/uvggt/image/upload/f_auto/v1565039253/2019/Agosto/Girls%20STEAM%20club%203/Steam-club-1.jpg"
          alt="Laboratorio de química"
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out ${
            isVisible ? "translate-x-0" : "-translate-x-full"
          }`}
        />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div
            className={`sm:mx-auto sm:w-full sm:max-w-md transition-all duration-700 ease-out transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="bg-white py-8 px-4 sm:rounded-lg sm:px-10">
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <Lock className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <h2 className="text-5xl text-center font-bold text-gray-800 mb-6">Restablecer Contraseña</h2>

              <p className="text-gray-600 text-center text-md mb-6">
                Ingresa tu nueva contraseña para restablecer tu cuenta.
              </p>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    Nueva Contraseña
                  </label>
                  <div className="mt-1">
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      required
                      placeholder="Ingresa tu nueva contraseña"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirmar Contraseña
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      placeholder="Confirma tu nueva contraseña"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Button
                    type="submit"
                    className="w-full bg-base text-white hover:bg-accent rounded-md flex gap-3 items-center justify-center"
                  >
                    {status === "idle" && <span>Restablecer Contraseña</span>}
                    {status === "loading" && (
                      <>
                        <span>Procesando</span>
                        <LoaderCircle className="animate-spin" />
                      </>
                    )}
                    {status === "success" && (
                      <>
                        <span>¡Éxito!</span>
                        <Check />
                      </>
                    )}
                    {status === "error" && (
                      <>
                        <span>Error</span>
                        <X />
                      </>
                    )}
                  </Button>
                </div>

                <div className="text-center mt-4 w-full block">
                  <a
                    href="/login"
                    className="w-full bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-md flex gap-3 items-center justify-center px-4 py-2"
                  >
                    Regresar a Iniciar Sesión
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reset

