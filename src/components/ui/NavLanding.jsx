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
import { Button } from "@/components/ui/Button"
import ProjectModal from "@/components/ProjectModal"
import { BASE_URL } from "@/lib/constants"

const NavBar = ({ loading: initialLoading }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(initialLoading)
  const [error, setError] = useState(null)

  // Cargar proyectos al montar el componente
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${BASE_URL}/api/proyects`)

        if (!response.ok) {
          throw new Error("Error al cargar los proyectos")
        }

        const data = await response.json()

        // Ordenar por fecha de creación (más recientes primero) y limitar a 4
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
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const openProjectModal = (projectId) => {
    setSelectedProjectId(projectId)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedProjectId(null)
  }

  // Renderizar esqueletos si está cargando
  if (loading) {
    return (
      <nav className="bg-base shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Skeleton className="w-[150px] h-[50px]" />
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Skeleton className="w-[400px] h-[40px]" />
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Skeleton className="h-10 w-28" />
            </div>
            <div className="flex items-center sm:hidden">
              <Skeleton className="h-10 w-10" />
            </div>
          </div>
        </div>
      </nav>
    )
  }

  // Renderizar mensaje de error si hay un error
  if (error) {
    return (
      <nav className="bg-base shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <img src="https://iili.io/3Awgque.jpg" alt="Logo" className="w-[50px] h-[50px]" />
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8 items-center">
                <p className="text-white">Error al cargar los proyectos</p>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Link to="/login">
                <Button
                  variant="quimica"
                  className="mr-2 text-lime-700 shadow-lg bg-white hover:bg-accent hover:text-white rounded-md font-semibold"
                >
                  Iniciar sesión
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
      <nav className="bg-base shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-white">
                  <img src="https://iili.io/3Awgque.jpg" alt="Logo" className="w-[50px] h-[50px]" />
                </span>
              </div>

              {/* Menú para pantallas grandes */}
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="text-lime-600">Proyectos Destacados</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid gap-3 p-4 md:w-[400px] bg-background lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                          {projects.length > 0 && (
                            <li className="row-span-3">
                              <NavigationMenuLink asChild>
                                <a
                                  className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-lime-500 to-lime-600 p-6 no-underline outline-none focus:shadow-md"
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    openProjectModal(projects[0].id)
                                  }}
                                >
                                  <div className="mt-4 text-lg font-medium text-white">{projects[0].nombre}</div>
                                  <p className="text-sm leading-tight text-white/90">
                                    {projects[0].informacion.substring(0, 100)}...
                                  </p>
                                </a>
                              </NavigationMenuLink>
                            </li>
                          )}

                          {projects.slice(1).map((project) => (
                            <li key={project.id}>
                              <NavigationMenuLink asChild>
                                <a
                                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-lime-100 focus:bg-lime-100"
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    openProjectModal(project.id)
                                  }}
                                >
                                  <div className="text-sm font-medium leading-none">{project.nombre}</div>
                                  <p className="line-clamp-2 text-sm leading-snug text-gray-500">
                                    {project.informacion.substring(0, 60)}...
                                  </p>
                                </a>
                              </NavigationMenuLink>
                            </li>
                          ))}

                          {/* Si no hay proyectos, mostrar mensaje */}
                          {projects.length === 0 && (
                            <li className="col-span-2 p-4 text-center text-gray-500">No hay proyectos disponibles</li>
                          )}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <a
                        href="#about"
                        onClick={(e) => handleSmoothScroll(e, "#about")}
                        className="text-white hover:text-lime-200 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Acerca de
                      </a>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <a
                        href="#members"
                        onClick={(e) => handleSmoothScroll(e, "#members")}
                        className="text-white hover:text-lime-200 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Conócenos
                      </a>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <a
                        href="#contact"
                        onClick={(e) => handleSmoothScroll(e, "#contact")}
                        className="text-white hover:text-lime-200 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Contacto
                      </a>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            </div>

            {/* Botón de login para pantallas grandes */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Link to="/login">
                <Button
                  variant="quimica"
                  className="mr-2 text-lime-700 shadow-lg bg-white hover:bg-accent hover:text-white rounded-md font-semibold"
                >
                  Iniciar sesión
                </Button>
              </Link>
            </div>

            {/* Botón hamburguesa para pantallas pequeñas */}
            <div className="flex items-center sm:hidden">
              <Button variant="ghost" className="text-white" onClick={toggleMenu}>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </Button>
            </div>
          </div>

          {/* Menú desplegable para pantallas pequeñas */}
          {isMenuOpen && (
            <div className="sm:hidden bg-base shadow-md px-4 py-2">
              <div className="flex flex-col space-y-2">
                
                <a href="#about" className="text-white hover:text-lime-200 px-3 py-2 rounded-md text-sm font-medium">
                  Acerca de
                </a>
                <a href="#contact" className="text-white hover:text-lime-200 px-3 py-2 rounded-md text-sm font-medium">
                  Contacto
                </a>
                <a href="#members" className="text-white hover:text-lime-200 px-3 py-2 rounded-md text-sm font-medium">
                  Conócenos
                </a>
                <Link to="/login">
                  <Button
                    variant="quimica"
                    className="text-lime-700 bg-white hover:bg-accent hover:text-white rounded-md font-semibold w-full"
                  >
                    Iniciar sesión
                  </Button>
                </Link>
                {/* Menú de proyectos destacados en móviles */}
                <div className="pt-2 ">
                  <span className="text-lime-600 px-3 py-2 text-sm font-medium mr-10">Proyectos Destacados</span>
                  <div className="pl-4 space-y-2">
                    {projects.length > 0 ? (
                      projects.map((project) => (
                        <a
                          key={project.id}
                          href="#"
                          className="block text-white hover:text-lime-200 px-3 py-2 rounded-md text-sm"
                          onClick={(e) => {
                            e.preventDefault()
                            openProjectModal(project.id)
                          }}
                        >
                          {project.nombre}
                        </a>
                      ))
                    ) : (
                      <p className="text-white/70 px-3 py-2 text-sm">No hay proyectos disponibles</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Project Modal */}
      <ProjectModal isOpen={modalOpen} onClose={closeModal} projectId={selectedProjectId} />
    </>
  )
}

export default NavBar

