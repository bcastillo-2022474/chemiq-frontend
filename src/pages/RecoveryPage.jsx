import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import { generateResetLinkRequest } from "@/actions/users.js"
import { Check, X, LoaderCircle } from "lucide-react"
import { getColors } from "@/actions/personalization"

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
  const isVisible = true
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState("idle")
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
              <h2 className="text-5xl text-center font-bold text-gray-800 mb-6">
                Recuperar Contraseña
              </h2>
              <p className="text-gray-600 text-center text-md text-gray-600 mb-6">
                Ingresa tu correo electrónico y te enviaremos un enlace para
                recuperar tu contraseña.
              </p>
              <form
                className="space-y-6"
                onSubmit={async e => {
                  e.preventDefault()
                  try {
                    if (status !== "idle") return
                    setStatus("loading")
                    const [error] = await generateResetLinkRequest({ email })

                    if (error) {
                      setStatus("error")
                      void Swal.fire("Error", error.response.data.message, "error")
                      return
                    }
                    void Swal.fire(
                      "Enlace enviado",
                      "Hemos enviado un enlace a tu correo electrónico",
                      "success"
                    )
                    setStatus("success")
                    setEmail("")
                  } catch {
                    setStatus("error")
                    void Swal.fire("Error", "No se pudo enviar el enlace", "error")
                  } finally {
                    setTimeout(() => {
                      setStatus("idle")
                    }, 3000)
                  }
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
                    className="w-full rounded-md flex gap-3 items-center justify-center"
                    style={{
                      backgroundColor: theme.colors.Primary || '#fc5000',
                      color: theme.colors.Secondary || '#e4e4e4'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = theme.colors.Accent || '#505050'
                      e.target.style.color = theme.colors.Secondary || '#e4e4e4'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = theme.colors.Primary || '#fc5000'
                      e.target.style.color = theme.colors.Secondary || '#e4e4e4'
                    }}
                  >
                    {status === "idle" && <span>Enviar Enlace</span>}
                    {status === "loading" && (
                      <>
                        <span>Enviando</span>
                        <LoaderCircle className="animate-spin" style={{ color: theme.colors.Secondary || '#e4e4e4' }} />
                      </>
                    )}
                    {status === "success" && (
                      <>
                        <span>Enviado</span>
                        <Check style={{ color: theme.colors.Secondary || '#e4e4e4' }} />
                      </>
                    )}
                    {status === "error" && (
                      <>
                        <span>Error</span>
                        <X style={{ color: theme.colors.Secondary || '#e4e4e4' }} />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecoveryPage