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
    colors: {}, // Inicialmente vacío
    images: {}, // Otros datos del tema
  });

  const fetchLogoImages = async () => {
    setLoading(true);
    try {
      const [error, images] = await getImages();
      if (error) {
        console.error("Error fetching images:", error);
        setLoading(false);
        return;
      }
  
      const logoImages = images.filter((image) => image.tipo === "Logo");
  
      setTheme((prevTheme) => ({
        ...prevTheme,
        images: {
          ...prevTheme.images,
          logo: logoImages[0], 
        },
      }));
  
      console.log("Fetched logo images:", logoImages); 
    } catch (err) {
      console.error("Unexpected error fetching images:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchColors = async () => {
    setLoading(true);
    const [error, colors] = await getColors();
    if (error) {
      console.error("Error fetching colors:", error);
      setLoading(false);
      return;
    }
    const formattedColors = Object.fromEntries(
      colors.map((color) => [color.nombre, color.hex])
    );
    setTheme((prevTheme) => ({
      ...prevTheme,
      colors: formattedColors,
    }));
    setLoading(false);
  };

  useEffect(() => {
    fetchColors();
    fetchLogoImages();
  }, []);

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

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault()
    const targetElement = document.querySelector(targetId)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  const openProjectModal = (projectId) => {
    setSelectedProjectId(projectId)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedProjectId(null)
  }

  if (loading) {
    return (
      <nav className="shadow-md fixed top-0 left-0 w-full z-50" style={{ backgroundColor: theme.colors.Primary || '#fc5000' }}>
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

  if (error) {
    return (
      <nav className="shadow-md fixed top-0 left-0 w-full z-50" style={{ backgroundColor: theme.colors.Primary || '#fc5000' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <img src={theme.images.logo?.enlace || "https://via.placeholder.com/150x150"} alt="Logo" className="w-[50px] h-[50px]" />
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8 items-center">
                <p style={{ color: theme.colors.Secondary || '#e4e4e4' }}>Error al cargar los proyectos</p>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Link to="/login">
                <Button 
                  variant="quimica" 
                  className="mr-2 rounded-md font-semibold"
                  style={{ 
                    backgroundColor: theme.colors.Background || '#fff8f0',
                    color: theme.colors.Accent || '#505050'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = theme.colors.Accent || '#505050';
                    e.target.style.color = theme.colors.Secondary || '#e4e4e4';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = theme.colors.Background || '#fff8f0';
                    e.target.style.color = theme.colors.Accent || '#505050';
                  }}
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
      <nav 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled 
            ? 'backdrop-blur-md shadow-lg' 
            : 'shadow-md'
        }`}
        style={{
          height: scrolled ? '64px' : '64px',
          transform: `translateY(${scrolled && isMenuOpen ? '0' : '0'}px)`,
          backgroundColor: theme.colors.Primary || '#fc5000'
        }}
      >
        <div 
          className="h-0.5" 
          style={{ 
            width: `${scrollProgress}%`, 
            transition: 'width 0.2s ease-out',
            backgroundColor: theme.colors.Accent || '#505050'
          }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold">
                  <img 
                    src={theme.images.logo?.enlace || "https://via.placeholder.com/150x150"}
                    alt="Logo" 
                    className={`transition-all duration-300 ${
                      scrolled ? 'w-[40px] h-[40px]' : 'w-[50px] h-[50px]'
                    }`} 
                  />
                </span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger 
                        className="transition-all duration-300"
                        style={{ color: theme.colors.Accent || '#505050' }}
                      >
                        Proyectos Destacados
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]" style={{ backgroundColor: theme.colors.Background || '#fff8f0' }}>
                          {projects.length > 0 && (
                            <li className="row-span-3">
                              <NavigationMenuLink asChild>
                                <a 
                                  className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b p-6 no-underline outline-none focus:shadow-md" 
                                  href="#" 
                                  onClick={(e) => { e.preventDefault(); openProjectModal(projects[0].id) }}
                                  style={{ 
                                    background: `linear-gradient(to bottom, ${theme.colors.Primary || '#fc5000'}, ${theme.colors.Tertiary || '#5f5f5f'})`
                                  }}
                                >
                                  <div className="mt-4 text-lg font-medium" style={{ color: theme.colors.Secondary || '#e4e4e4' }}>{projects[0].nombre}</div>
                                  <p className="text-sm leading-tight" style={{ color: theme.colors.Secondary || '#e4e4e4' }}>{projects[0].informacion.substring(0, 100)}...</p>
                                </a>
                              </NavigationMenuLink>
                            </li>
                          )}
                          {projects.slice(1).map((project) => (
                            <li key={project.id}>
                              <NavigationMenuLink asChild>
                                <a 
                                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/10 focus:bg-accent/10" 
                                  href="#" 
                                  onClick={(e) => { e.preventDefault(); openProjectModal(project.id) }}
                                >
                                  <div className="text-sm font-medium leading-none" style={{ color: theme.colors.Secondary || '#e4e4e4' }}>{project.nombre}</div>
                                  <p className="line-clamp-2 text-sm leading-snug" style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>{project.informacion.substring(0, 60)}...</p>
                                </a>
                              </NavigationMenuLink>
                            </li>
                          ))}
                          {projects.length === 0 && (
                            <li className="col-span-2 p-4 text-center" style={{ color: theme.colors.Tertiary || '#5f5f5f' }}>No hay proyectos disponibles</li>
                          )}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <a 
                        href="#about" 
                        onClick={(e) => handleSmoothScroll(e, "#about")} 
                        className="transition-all duration-300 px-3 py-2 rounded-md text-sm font-medium"
                        style={{ 
                          color: theme.colors.Secondary || '#e4e4e4',
                          ':hover': { color: theme.colors.Primary || '#fc5000' }
                        }}
                        onMouseEnter={(e) => e.target.style.color = theme.colors.Primary || '#fc5000'}
                        onMouseLeave={(e) => e.target.style.color = theme.colors.Secondary || '#e4e4e4'}
                      >
                        Acerca de
                      </a>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <a 
                        href="#members" 
                        onClick={(e) => handleSmoothScroll(e, "#members")} 
                        className="transition-all duration-300 px-3 py-2 rounded-md text-sm font-medium"
                        style={{ 
                          color: theme.colors.Secondary || '#e4e4e4',
                          ':hover': { color: theme.colors.Primary || '#fc5000' }
                        }}
                        onMouseEnter={(e) => e.target.style.color = theme.colors.Primary || '#fc5000'}
                        onMouseLeave={(e) => e.target.style.color = theme.colors.Secondary || '#e4e4e4'}
                      >
                        Conócenos
                      </a>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <a 
                        href="#contact" 
                        onClick={(e) => handleSmoothScroll(e, "#contact")} 
                        className="transition-all duration-300 px-3 py-2 rounded-md text-sm font-medium"
                        style={{ 
                          color: theme.colors.Secondary || '#e4e4e4',
                          ':hover': { color: theme.colors.Primary || '#fc5000' }
                        }}
                        onMouseEnter={(e) => e.target.style.color = theme.colors.Primary || '#fc5000'}
                        onMouseLeave={(e) => e.target.style.color = theme.colors.Secondary || '#e4e4e4'}
                      >
                        Contacto
                      </a>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Link to="/login">
                <Button 
                  variant="quimica" 
                  className="transition-all duration-300 mr-2 shadow-lg rounded-md font-semibold"
                  style={{ 
                    backgroundColor: theme.colors.Background || '#fff8f0',
                    color: theme.colors.Accent || '#505050'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = theme.colors.Accent || '#505050';
                    e.target.style.color = theme.colors.Secondary || '#e4e4e4';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = theme.colors.Background || '#fff8f0';
                    e.target.style.color = theme.colors.Accent || '#505050';
                  }}
                >
                  Iniciar sesión
                </Button>
              </Link>
            </div>
            <div className="flex items-center sm:hidden">
              <Button 
                variant="ghost" 
                className="transition-all duration-300" 
                onClick={toggleMenu}
                style={{ color: theme.colors.Secondary || '#e4e4e4' }}
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </Button>
            </div>
          </div>
          {isMenuOpen && (
            <div 
              className="sm:hidden px-4 py-2 transition-all duration-300"
              style={{ backgroundColor: theme.colors.Primary || '#fc5000' }}
            >
              <div className="flex flex-col space-y-2">
                <a 
                  href="#about" 
                  className="px-3 py-2 rounded-md text-sm font-medium"
                  style={{ 
                    color: theme.colors.Secondary || '#e4e4e4',
                    ':hover': { color: theme.colors.Primary || '#fc5000' }
                  }}
                  onMouseEnter={(e) => e.target.style.color = theme.colors.Primary || '#fc5000'}
                  onMouseLeave={(e) => e.target.style.color = theme.colors.Secondary || '#e4e4e4'}
                >
                  Acerca de
                </a>
                <a 
                  href="#contact" 
                  className="px-3 py-2 rounded-md text-sm font-medium"
                  style={{ 
                    color: theme.colors.Secondary || '#e4e4e4',
                    ':hover': { color: theme.colors.Primary || '#fc5000' }
                  }}
                  onMouseEnter={(e) => e.target.style.color = theme.colors.Primary || '#fc5000'}
                  onMouseLeave={(e) => e.target.style.color = theme.colors.Secondary || '#e4e4e4'}
                >
                  Contacto
                </a>
                <a 
                  href="#members" 
                  className="px-3 py-2 rounded-md text-sm font-medium"
                  style={{ 
                    color: theme.colors.Secondary || '#e4e4e4',
                    ':hover': { color: theme.colors.Primary || '#fc5000' }
                  }}
                  onMouseEnter={(e) => e.target.style.color = theme.colors.Primary || '#fc5000'}
                  onMouseLeave={(e) => e.target.style.color = theme.colors.Secondary || '#e4e4e4'}
                >
                  Conócenos
                </a>
                <Link to="/login">
                  <Button 
                    variant="quimica" 
                    className="rounded-md font-semibold w-full"
                    style={{ 
                      backgroundColor: theme.colors.Background || '#fff8f0',
                      color: theme.colors.Accent || '#505050'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = theme.colors.Accent || '#505050';
                      e.target.style.color = theme.colors.Secondary || '#e4e4e4';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = theme.colors.Background || '#fff8f0';
                      e.target.style.color = theme.colors.Accent || '#505050';
                    }}
                  >
                    Iniciar sesión
                  </Button>
                </Link>
                <div className="pt-2">
                  <span 
                    className="px-3 py-2 text-sm font-medium mr-10"
                    style={{ color: theme.colors.Accent || '#505050' }}
                  >
                    Proyectos Destacados
                  </span>
                  <div className="pl-4 space-y-2">
                    {projects.length > 0 ? (
                      projects.map((project) => (
                        <a 
                          key={project.id} 
                          href="#" 
                          className="block px-3 py-2 rounded-md text-sm"
                          style={{ 
                            color: theme.colors.Secondary || '#e4e4e4',
                            ':hover': { color: theme.colors.Primary || '#fc5000' }
                          }}
                          onClick={(e) => { e.preventDefault(); openProjectModal(project.id) }}
                          onMouseEnter={(e) => e.target.style.color = theme.colors.Primary || '#fc5000'}
                          onMouseLeave={(e) => e.target.style.color = theme.colors.Secondary || '#e4e4e4'}
                        >
                          {project.nombre}
                        </a>
                      ))
                    ) : (
                      <p 
                        className="px-3 py-2 text-sm"
                        style={{ color: theme.colors.Tertiary || '#5f5f5f' }}
                      >
                        No hay proyectos disponibles
                      </p>
                    )}
                  </div>
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