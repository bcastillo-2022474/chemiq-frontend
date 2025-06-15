"use client"

import { useState, useEffect } from "react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Link } from "react-router-dom"
import { Skeleton } from "@/components/SkeletonsLanding"
import { Button } from "@/components/ui/button"
import ProjectModal from "@/components/ProjectModal"
import { BASE_URL } from "@/lib/constants"
import { getColors } from "../../actions/personalization"
import { getImages } from "../../actions/image"
import { ChevronDown, Menu, X, Sparkles, ArrowRight, ExternalLink } from "lucide-react"

const NavBar = ({ loading: initialLoading }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(initialLoading)
  const [error, setError] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [theme, setTheme] = useState({
    colors: {},
    images: {},
  })

  const fetchLogoImages = async () => {
    setLoading(true)
    try {
      const [error, images] = await getImages()
      if (error) {
        console.error("Error fetching images:", error)
        setLoading(false)
        return
      }

      const logoImages = images.filter((image) => image.tipo === "Logo")

      setTheme((prevTheme) => ({
        ...prevTheme,
        images: {
          ...prevTheme.images,
          logo: logoImages[0],
        },
      }))

      console.log("Fetched logo images:", logoImages)
    } catch (err) {
      console.error("Unexpected error fetching images:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchColors = async () => {
    setLoading(true)
    const [error, colors] = await getColors()
    if (error) {
      console.error("Error fetching colors:", error)
      setLoading(false)
      return
    }
    const formattedColors = Object.fromEntries(colors.map((color) => [color.nombre, color.hex]))
    setTheme((prevTheme) => ({
      ...prevTheme,
      colors: formattedColors,
    }))
    setLoading(false)
  }

  useEffect(() => {
    fetchColors()
    fetchLogoImages()
  }, [])

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${BASE_URL}/api/proyects`)
        if (!response.ok) {
          throw new Error("Error al cargar los proyectos")
        }
        const data = await response.json()
        const sortedProjects = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 4)
        setProjects(sortedProjects)
      } catch (err) {
        console.error("Error al cargar los proyectos:", err)
        setError("No se pudieron cargar los proyectos")
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()

    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const progress = (scrollPosition / windowHeight) * 100

      setScrollProgress(progress)
      setScrolled(scrollPosition > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault()
    const targetElement = document.querySelector(targetId)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  const openProjectModal = (projectId) => {
    setSelectedProjectId(projectId)
    setModalOpen(true)
    setIsMenuOpen(false)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedProjectId(null)
  }

  if (loading) {
    return (
      <nav
        className="fixed top-0 left-0 w-full z-50 backdrop-blur-md border-b border-white/10"
        style={{ backgroundColor: `${theme.colors.Primary || "#fc5000"}CC` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-8">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <div className="hidden md:flex space-x-6">
                <Skeleton className="w-32 h-6 rounded-full" />
                <Skeleton className="w-24 h-6 rounded-full" />
                <Skeleton className="w-28 h-6 rounded-full" />
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Skeleton className="w-32 h-10 rounded-xl" />
            </div>
            <div className="md:hidden">
              <Skeleton className="w-10 h-10 rounded-lg" />
            </div>
          </div>
        </div>
      </nav>
    )
  }

  if (error) {
    return (
      <nav
        className="fixed top-0 left-0 w-full z-50 backdrop-blur-md border-b border-white/10"
        style={{ backgroundColor: `${theme.colors.Primary || "#fc5000"}CC` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={theme.images.logo?.enlace || "https://via.placeholder.com/150x150"}
                  alt="Logo"
                  className="w-12 h-12 rounded-xl shadow-lg"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
              </div>
              <div className="hidden md:block">
                <p className="text-white/80 font-medium">Error al cargar los proyectos</p>
              </div>
            </div>
            <div className="hidden md:flex items-center">
              <Link to="/login">
                <Button className="group relative overflow-hidden px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <span className="relative z-10 flex items-center gap-2">
                    Iniciar sesión
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out ${
          scrolled ? "backdrop-blur-xl shadow-2xl border-b border-white/10" : "backdrop-blur-md shadow-lg"
        }`}
        style={{
          backgroundColor: scrolled
            ? `${theme.colors.Primary || "#fc5000"}E6`
            : `${theme.colors.Primary || "#fc5000"}CC`,
        }}
      >
        {/* Scroll Progress Bar */}
        <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 transition-all duration-300 ease-out shadow-lg">
          <div
            className="h-full bg-gradient-to-r from-white via-yellow-200 to-white transition-all duration-200 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Section */}
            <div className="flex items-center space-x-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <img
                  src={theme.images.logo?.enlace || "https://via.placeholder.com/150x150"}
                  alt="Logo"
                  className={`transition-all duration-500 ease-out rounded-xl shadow-lg ${
                    scrolled ? "w-10 h-10" : "w-12 h-12"
                  } group-hover:scale-110`}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent" />
              </div>

                      <div className="hidden md:flex items-center space-x-2">
                      <NavigationMenu>
                        <NavigationMenuList className="space-x-2">
                        <NavigationMenuItem>
                          <NavigationMenuTrigger
                          className="group bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300
                            hover:shadow-lg
                            focus:outline-none
                          "
                          style={{
                            backgroundColor: theme.colors.Primary
                            ? `${theme.colors.Primary}22`
                            : undefined,
                          }}
                          onMouseOver={e => {
                            e.currentTarget.style.backgroundColor = theme.colors.Primary
                            ? `${theme.colors.Primary}44`
                            : "#fc500044"
                          }}
                          onMouseOut={e => {
                            e.currentTarget.style.backgroundColor = theme.colors.Primary
                            ? `${theme.colors.Primary}22`
                            : "#fc500022"
                          }}
                          onFocus={e => {
                            e.currentTarget.style.boxShadow = theme.colors.Primary
                            ? `0 0 0 3px ${theme.colors.Primary}55`
                            : "0 0 0 3px #fc500055"
                            e.currentTarget.style.backgroundColor = theme.colors.Primary
                            ? `${theme.colors.Primary}44`
                            : "#fc500044"
                          }}
                          onBlur={e => {
                            e.currentTarget.style.boxShadow = ""
                            e.currentTarget.style.backgroundColor = theme.colors.Primary
                            ? `${theme.colors.Primary}22`
                            : "#fc500022"
                          }}
                          >
                          <Sparkles className="w-4 h-4" />
                          Proyectos Destacados
                          <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]:rotate-180" />
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                          <div
                            className="w-[600px] p-6 rounded-2xl shadow-2xl border border-gray-200/20 backdrop-blur-xl"
                            style={{ backgroundColor: `${theme.colors.Background || "#fff8f0"}F5` }}
                          >
                            <div className="grid gap-4 lg:grid-cols-2">
                            {projects.length > 0 && (
                              <div className="lg:col-span-1">
                              <NavigationMenuLink asChild>
                                <a
                                className="group relative flex h-full w-full select-none flex-col justify-end rounded-xl p-6 no-underline outline-none focus:shadow-md overflow-hidden transition-all duration-300"
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault()
                                  openProjectModal(projects[0].id)
                                }}
                                style={{
                                  background: `linear-gradient(135deg, ${
                                  theme.colors.Primary || "#fc5000"
                                  }, ${theme.colors.Tertiary || "#5f5f5f"})`,
                                }}
                                onMouseOver={e => {
                                  e.currentTarget.style.filter = "brightness(1.08)"
                                }}
                                onMouseOut={e => {
                                  e.currentTarget.style.filter = ""
                                }}
                                onFocus={e => {
                                  e.currentTarget.style.boxShadow = theme.colors.Primary
                                  ? `0 0 0 3px ${theme.colors.Primary}55`
                                  : "0 0 0 3px #fc500055"
                                }}
                                onBlur={e => {
                                  e.currentTarget.style.boxShadow = ""
                                }}
                                >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                                <div className="relative z-10">
                                  <div className="flex items-center gap-2 mb-3">
                                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                  <span className="text-xs font-medium text-white/80 uppercase tracking-wider">
                                    Proyecto Destacado
                                  </span>
                                  </div>
                                  <div className="text-xl font-bold text-white mb-2 group-hover:text-yellow-200 transition-colors">
                                  {projects[0].nombre}
                                  </div>
                                  <p className="text-sm leading-tight text-white/90 line-clamp-3">
                                  {projects[0].informacion.substring(0, 120)}...
                                  </p>
                                  <div className="flex items-center gap-2 mt-4 text-white/80 group-hover:text-white transition-colors">
                                  <span className="text-xs font-medium">Ver detalles</span>
                                  <ExternalLink className="w-3 h-3" />
                                  </div>
                                </div>
                                </a>
                              </NavigationMenuLink>
                              </div>
                            )}
                            <div className="space-y-2">
                              {projects.slice(1).map((project, index) => (
                              <NavigationMenuLink key={project.id} asChild>
                                <a
                                className="group block select-none space-y-2 rounded-xl p-4 leading-none no-underline outline-none transition-all duration-300 border border-transparent"
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault()
                                  openProjectModal(project.id)
                                }}
                                style={{
                                  backgroundColor: theme.colors.Primary
                                  ? `${theme.colors.Primary}0A`
                                  : "#fc50000A",
                                }}
                                onMouseOver={e => {
                                  e.currentTarget.style.backgroundColor = theme.colors.Primary
                                  ? `${theme.colors.Primary}22`
                                  : "#fc500022"
                                  e.currentTarget.style.borderColor = theme.colors.Primary
                                  ? `${theme.colors.Primary}55`
                                  : "#fc500055"
                                }}
                                onMouseOut={e => {
                                  e.currentTarget.style.backgroundColor = theme.colors.Primary
                                  ? `${theme.colors.Primary}0A`
                                  : "#fc50000A"
                                  e.currentTarget.style.borderColor = "transparent"
                                }}
                                onFocus={e => {
                                  e.currentTarget.style.boxShadow = theme.colors.Primary
                                  ? `0 0 0 2px ${theme.colors.Primary}55`
                                  : "0 0 0 2px #fc500055"
                                  e.currentTarget.style.backgroundColor = theme.colors.Primary
                                  ? `${theme.colors.Primary}22`
                                  : "#fc500022"
                                  e.currentTarget.style.borderColor = theme.colors.Primary
                                  ? `${theme.colors.Primary}55`
                                  : "#fc500055"
                                }}
                                onBlur={e => {
                                  e.currentTarget.style.boxShadow = ""
                                  e.currentTarget.style.backgroundColor = theme.colors.Primary
                                  ? `${theme.colors.Primary}0A`
                                  : "#fc50000A"
                                  e.currentTarget.style.borderColor = "transparent"
                                }}
                                >
                                <div className="flex items-center justify-between">
                                  <div className="text-sm font-semibold leading-none text-gray-900 group-hover:text-orange-600 transition-colors">
                                  {project.nombre}
                                  </div>
                                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-all transform group-hover:translate-x-1" />
                                </div>
                                <p className="line-clamp-2 text-xs leading-snug text-gray-600 group-hover:text-gray-800 transition-colors">
                                  {project.informacion.substring(0, 80)}...
                                </p>
                                </a>
                              </NavigationMenuLink>
                              ))}
                              {projects.length === 0 && (
                              <div className="col-span-2 p-8 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <Sparkles className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-gray-500 font-medium">No hay proyectos disponibles</p>
                              </div>
                              )}
                            </div>
                            </div>
                          </div>
                          </NavigationMenuContent>
                        </NavigationMenuItem>

                        {[
                          { href: "#about", text: "Acerca de" },
                          { href: "#members", text: "Conócenos" },
                          { href: "#contact", text: "Contacto" },
                        ].map((item, index) => (
                          <NavigationMenuItem key={index}>
                          <a
                            href={item.href}
                            onClick={(e) => handleSmoothScroll(e, item.href)}
                            className="group relative px-4 py-2 text-white font-medium rounded-xl transition-all duration-300 flex items-center gap-2"
                            style={{
                            backgroundColor: theme.colors.Primary
                              ? `${theme.colors.Primary}0A`
                              : "#fc50000A",
                            }}
                            onMouseOver={e => {
                            e.currentTarget.style.backgroundColor = theme.colors.Primary
                              ? `${theme.colors.Primary}22`
                              : "#fc500022"
                            }}
                            onMouseOut={e => {
                            e.currentTarget.style.backgroundColor = theme.colors.Primary
                              ? `${theme.colors.Primary}0A`
                              : "#fc50000A"
                            }}
                            onFocus={e => {
                            e.currentTarget.style.boxShadow = theme.colors.Primary
                              ? `0 0 0 2px ${theme.colors.Primary}55`
                              : "0 0 0 2px #fc500055"
                            e.currentTarget.style.backgroundColor = theme.colors.Primary
                              ? `${theme.colors.Primary}22`
                              : "#fc500022"
                            }}
                            onBlur={e => {
                            e.currentTarget.style.boxShadow = ""
                            e.currentTarget.style.backgroundColor = theme.colors.Primary
                              ? `${theme.colors.Primary}0A`
                              : "#fc50000A"
                            }}
                          >
                            <span className="relative z-10">{item.text}</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </a>
                          </NavigationMenuItem>
                        ))}
                        </NavigationMenuList>
                      </NavigationMenu>
                      </div>
                    </div>

            <div className="hidden md:flex items-center">
              <Link to="/login">
                <Button className="group relative overflow-hidden px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  <span className="relative z-10 flex items-center gap-2">
                    Iniciar sesión
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                className="p-2 text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                onClick={toggleMenu}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-white/10">
              <div className="px-4 py-6 space-y-4 bg-black/20 backdrop-blur-sm rounded-b-2xl">
                {[
                  { href: "#about", text: "Acerca de" },
                  { href: "#members", text: "Conócenos" },
                  { href: "#contact", text: "Contacto" },
                ].map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    onClick={(e) => handleSmoothScroll(e, item.href)}
                    className="block px-4 py-3 text-white font-medium rounded-xl hover:bg-white/10 transition-all duration-300"
                  >
                    {item.text}
                  </a>
                ))}

                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 px-4 py-2 text-white/80 text-sm font-medium">
                    <Sparkles className="w-4 h-4" />
                    Proyectos Destacados
                  </div>
                  <div className="pl-4 space-y-2">
                    {projects.length > 0 ? (
                      projects.map((project) => (
                        <a
                          key={project.id}
                          href="#"
                          className="block px-4 py-2 text-white/90 text-sm rounded-lg hover:bg-white/10 transition-all duration-300"
                          onClick={(e) => {
                            e.preventDefault()
                            openProjectModal(project.id)
                          }}
                        >
                          {project.nombre}
                        </a>
                      ))
                    ) : (
                      <p className="px-4 py-2 text-white/60 text-sm">No hay proyectos disponibles</p>
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  <Link to="/login">
                    <Button className="w-full group relative overflow-hidden px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300">
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Iniciar sesión
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
      <ProjectModal isOpen={modalOpen} onClose={closeModal} projectId={selectedProjectId} />
    </>
  )
}

export default NavBar
