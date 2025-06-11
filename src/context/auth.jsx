import { createContext, useState, useEffect, useContext } from "react"
import { loginRequest, logoutRequest, verifyAuthRequest } from "@/actions/auth"
import { useNavigate } from "react-router-dom"
import { setUpInterceptors } from "../lib/http" // Update this import path

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  const [authState, setAuthState] = useState({
    loading: true,
    authenticated: false,
    user: null,
    refreshing: false // Added refreshing state
  })

  const setRefreshing = (refreshing) => {
    setAuthState(prev => ({ ...prev, refreshing }))
  }

  const verifyAuth = async () => {
    const [error, user] = await verifyAuthRequest()

    if (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        authenticated: false,
        user: null
      }))
      return null
    }

    setAuthState(prev => ({
      ...prev,
      loading: false,
      authenticated: true,
      user
    }))
    return user
  }

  const login = async credentials => {
    const [error] = await loginRequest(credentials)
    if (error) {
      return false
    }
    const claims = await verifyAuth()
    console.log(claims)

    if (!claims) return false

    if (claims.rol === "Admin") navigate("/dashboard/stats")
    if (claims.rol === "Junta") navigate("/juntapage")
    if (claims.rol === "User") navigate("/portal")

    return true
  }

  const logout = async () => {
    const [error] = await logoutRequest()
    if (error) {
      return false
    }

    setAuthState({
      loading: false,
      authenticated: false,
      user: null,
      refreshing: false
    })
    navigate("/login")
  }

  // Set up interceptors with access to setRefreshing and verifyAuth
  useEffect(() => {
    setUpInterceptors(navigate, setRefreshing, verifyAuth)
  }, [navigate])

  useEffect(() => {
    void verifyAuth()
  }, [])

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      verifyAuth,
      setRefreshing
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)