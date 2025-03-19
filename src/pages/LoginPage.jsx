import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"
import React from "react"
import { useAuth } from "@/context/auth"

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

const LoginPage = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useAuth()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleLogin = async e => {
    e.preventDefault()
    const logged = await login({ email, password })

    if (!logged) {
      void Swal.fire("Error", "No se pudo iniciar sesión", "error")
      return
    }

    void Swal.fire(
      "Login exitoso",
      "Has iniciado sesión correctamente",
      "success"
    )
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
        <div
          className={`max-w-md w-full space-y-8 transition-all duration-700 ease-out transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div
            className={`text-center transition-all duration-700 delay-100 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <h1 className="text-5xl font-bold text-gray-800">Iniciar Sesión</h1>
            <p className="mt-2 text-xl text-gray-600">
              Accede a tu portal de química
            </p>
          </div>
          <form
            className={`mt-8 space-y-6 transition-all duration-700 delay-200 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            onSubmit={handleLogin}
          >
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Correo Electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="prueba11111@uvg.edu.gt"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/recovery"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-base text-white hover:bg-accent rounded-md"
              >
                Iniciar Sesión
              </Button>
            </div>
            <div className="mt-4">
              <Link to="/" className="w-full block">
                <Button className="w-full bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-md">
                  Regresar a la Página Principal
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
