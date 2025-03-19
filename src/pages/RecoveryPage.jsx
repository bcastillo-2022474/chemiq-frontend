import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import Swal from "sweetalert2"
import axios from "axios"
import { BASE_URL } from "@/lib/constants.js"

const Button = ({ children, className, variant, ...props }) => (
  <button
    className={`px-4 py-2 rounded ${className} ${
      variant === "outline" ? "border border-current" : ""
    }`}
    {...props}
  >
    {children}
  </button>
)

const RecoveryPage = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [token, setToken] = useState(null)
  const [newPassword, setNewPassword] = useState("")
  const location = useLocation()

  useEffect(() => {
    setIsVisible(true)
    const queryParams = new URLSearchParams(location.search)
    const tokenFromUrl = queryParams.get("token")
    if (tokenFromUrl) {
      setToken(tokenFromUrl)
      setStep(3)
    }
  }, [location.search])

  const handleSendCode = async () => {
    try {
      await axios.post("http://localhost:3000/api/forgotPassword", { email })
      Swal.fire(
        "Código enviado",
        `Se ha enviado un enlace a ${email} para recuperar tu contraseña.`,
        "success"
      )
    } catch (error) {
      Swal.fire("Error", "No se pudo enviar el correo electrónico", "error")
    }
  }

  const handleResetPassword = async () => {
    try {
      await axios.post(`${BASE_URL}/reset-password`, { token, newPassword })
      Swal.fire(
        "Contraseña actualizada",
        "Tu contraseña ha sido actualizada exitosamente",
        "success"
      )
      setStep(1)
      setEmail("")
      setNewPassword("")
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar la contraseña", "error")
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
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <div className="bg-white py-8 px-4 sm:rounded-lg sm:px-10">
              {step === 1 && (
                <>
                  <h2 className="text-5xl text-center font-bold text-gray-800 mb-6">
                    Recuperar Contraseña
                  </h2>
                  <p className="text-gray-600 text-center text-md text-gray-600 mb-6">
                    Ingresa tu correo electrónico y te enviaremos un enlace para
                    recuperar tu contraseña.
                  </p>
                  <form
                    className="space-y-6"
                    onSubmit={e => {
                      e.preventDefault()
                      handleSendCode()
                    }}
                  >
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Correo Electrónico
                      </label>
                      <div className="mt-1">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          placeholder="tu@ejemplo.com"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Button
                        type="submit"
                        className="w-full bg-base text-white hover:bg-accent rounded-md"
                      >
                        Enviar Enlace
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecoveryPage
