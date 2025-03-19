import React, { useState, useEffect } from "react"
import AutoCarousel from "@/components/AutoCarousel"
import MemberCard from "@/components/MemberCard"
import {
  AtomIcon,
  BookOpenIcon,
  UsersIcon,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin
} from "lucide-react"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu"
import { Link } from "react-router-dom"

// Importamos los skeletons mejorados
import {
  Skeleton,
  CarouselSkeleton,
  MemberCardSkeleton,
  TextSectionSkeleton,
  FormSkeleton,
  FeatureSkeleton,
  TitleSkeleton
} from "@/components/SkeletonsLanding"

const cards = [
  {
    imageUrl:
      "https://uvggt-my.sharepoint.com/:i:/r/personal/are24708_uvg_edu_gt/Documents/Fotos%20Equipo/Jos%C3%A9%20Paiz.png?csf=1&web=1&e=IBJsiC",
    hoverText: "José Pablo Paiz Hernández",
    cargo: "Presidente"
  },
  {
    imageUrl:
      "https://uvggt-my.sharepoint.com/:i:/r/personal/are24708_uvg_edu_gt/Documents/Fotos%20Equipo/Eduardo.png?csf=1&web=1&e=hJXqoy",
    hoverText: "Eduardo José Quiñónez Ovando",
    cargo: "Vocal de comunicación"
  },
  {
    imageUrl:
      "https://uvggt-my.sharepoint.com/:i:/r/personal/are24708_uvg_edu_gt/Documents/Fotos%20Equipo/Valeria.png?csf=1&web=1&e=cvsReb",
    hoverText: "Valeria Fernanda Sierra Cano",
    cargo: "Vicepresidente"
  },
  {
    imageUrl:
      "https://uvggt-my.sharepoint.com/:i:/r/personal/are24708_uvg_edu_gt/Documents/Fotos%20Equipo/Carmen.png?csf=1&web=1&e=SSyP5r",
    hoverText: "Carmen Sofía Lizama de la Cruz",
    cargo: "Vocal de proyectos"
  },
  {
    imageUrl:
      "https://uvggt-my.sharepoint.com/:i:/r/personal/are24708_uvg_edu_gt/Documents/Fotos%20Equipo/Luis.png?csf=1&web=1&e=SuHsHc",
    hoverText: "Luis Pablo Avila Alvarado",
    cargo: "Vocal de bienestar estudiantil"
  },
  {
    imageUrl:
      "https://uvggt-my.sharepoint.com/:i:/r/personal/are24708_uvg_edu_gt/Documents/Fotos%20Equipo/Arturo.png?csf=1&web=1&e=aa9nwG",
    hoverText: "Arturo René Joachín de León",
    cargo: "Tesorero"
  },
  {
    imageUrl:
      "https://uvggt-my.sharepoint.com/:i:/r/personal/are24708_uvg_edu_gt/Documents/Fotos%20Equipo/JuanPa.png?csf=1&web=1&e=MCmEA7",
    hoverText: "Juan Pablo León Serrano",
    cargo: "Vocal académico"
  },
  {
    imageUrl:
      "https://uvggt-my.sharepoint.com/:i:/r/personal/are24708_uvg_edu_gt/Documents/Fotos%20Equipo/Mijael.png?csf=1&web=1&e=f2LG8x",
    hoverText: "Mijael Roberto Juárez Monzón",
    cargo: "Vocal de innovación"
  },
  {
    imageUrl:
      "https://uvggt-my.sharepoint.com/:i:/r/personal/are24708_uvg_edu_gt/Documents/Fotos%20Equipo/Andrea.png?csf=1&web=1&e=YQLIEl",
    hoverText: "Andrea Ximena Arévalo Lopez",
    cargo: "Vocal de redes sociales"
  }
]
const Button = ({ children, className, variant = "" }) => (
  <button
    className={`px-4 py-2 rounded ${className} ${
      variant === "outline" ? "border border-current" : ""
    }`}
  >
    {children}
  </button>
)

const Input = ({ placeholder, type = "text" }) => (
  <input
    type={type}
    placeholder={placeholder}
    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-base"
  />
)

const images = [
  "https://res.cloudinary.com/uvggt/image/upload/f_auto/v1619631396/2021/Abril/Biodi%C3%A9sel/Biodiesel-1.jpg",
  "https://res.cloudinary.com/uvggt/image/upload/f_auto/v1707843136/2024/02%20Febrero/Premio%20ILAN/Premio-ILAN-Portada.jpg",
  "https://res.cloudinary.com/webuvg/image/upload/f_auto,q_auto,w_329,c_scale,fl_lossy,dpr_2.63/v1602887269/WEB/Academico/Carreras/Ingenieria/Quimica/laboratorio-ing-quimica.jpg",
  "https://res.cloudinary.com/uvggt/image/upload/f_auto/v1657039547/2022/Julio/Foro%20Desarrollo%20industrial%20verde/Ingenieria-Quimica-UVG-1.jpg",
  "https://res.cloudinary.com/uvggt/image/upload/f_auto/v1649106331/2022/Abril/Bodi%C3%A9sel-Puma/Biodiesel-1.jpg"
]

const LandingPage = () => {
  const [loading, setLoading] = useState(true)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [membersLoaded, setMembersLoaded] = useState(false)

  // Simulate loading time
  useEffect(() => {
    // Simulate carousel images loading
    const imageTimer = setTimeout(() => {
      setImagesLoaded(true)
    }, 2000)

    // Simulate member cards loading
    const memberTimer = setTimeout(() => {
      setMembersLoaded(true)
    }, 2500)

    // Set overall loading state
    const loadingTimer = setTimeout(() => {
      setLoading(false)
    }, 3000)

    return () => {
      clearTimeout(imageTimer)
      clearTimeout(memberTimer)
      clearTimeout(loadingTimer)
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-white ">
      <nav className="bg-base shadow-md ">
        <div className="max-w-7xl mx-auto px-4  sm:px-6 lg:px-8 ">
          <div className="flex justify-between h-16 ">
            <div className="flex ">
              <div className="flex-shrink-0 flex items-center">
                {loading ? (
                  <Skeleton className="w-[150px] h-[50px]" />
                ) : (
                  <span className="text-2xl font-bold text-white ">
                    <img
                      src="./src/assets/img/ChemiqLogoNav.png"
                      className="w-full h-[50px]"
                    />
                  </span>
                )}
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8 ">
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="text-lime-600 ">
                        Proyectos Destacados
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid gap-3 p-4 md:w-[400px] bg-background lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                          <li className="row-span-3 ">
                            <NavigationMenuLink asChild>
                              <a
                                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-lime-500 to-lime-600 p-6 no-underline outline-none focus:shadow-md"
                                href="/"
                              >
                                <div className="mt-4 text-lg font-medium text-white">
                                  BioDiesel
                                </div>
                                <p className="text-sm leading-tight text-white/90">
                                  La producción de biodiésel: una alternativa
                                  viable de reciclaje y una oportunidad de
                                  aprendizaje
                                </p>
                              </a>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink asChild>
                              <a
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-lime-100 focus:bg-lime-100"
                                href="/"
                              >
                                <div className="text-sm font-medium leading-none">
                                  Satelite Quetzal 1
                                </div>
                                <p className="line-clamp-2 text-sm leading-snug text-gray-500">
                                  El primer satelite guatemalteco
                                </p>
                              </a>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink asChild>
                              <a
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-lime-100 focus:bg-lime-100"
                                href="/"
                              >
                                <div className="text-sm font-medium leading-none">
                                  Proyecto X
                                </div>
                                <p className="line-clamp-2 text-sm leading-snug text-gray-500">
                                  Proyecto X
                                </p>
                              </a>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink asChild>
                              <a
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-lime-100 focus:bg-lime-100"
                                href="/"
                              >
                                <div className="text-sm font-medium leading-none">
                                  Proyecto X
                                </div>
                                <p className="line-clamp-2 text-sm leading-snug text-gray-500">
                                  Proyecto X
                                </p>
                              </a>
                            </NavigationMenuLink>
                          </li>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <a
                        href="#about"
                        className="text-white hover:text-lime-200 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Acerca de
                      </a>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <a
                        href="#contact"
                        className="text-white hover:text-lime-200 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Contacto
                      </a>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <a
                        href="#members"
                        className="text-white hover:text-lime-200 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Conocenos
                      </a>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {loading ? (
                <Skeleton className="h-10 w-28" />
              ) : (
                <Link to="/login">
                  <Button
                    variant="quimica"
                    className="mr-2 text-lime-700 shadow-lg bg-white hover:bg-accent hover:text-white rounded-md font-semibold"
                  >
                    Iniciar sesión
                  </Button>
                </Link>
              )}
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <Button variant="ghost" className="text-white">
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-tertiary">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                {loading ? (
                  <TextSectionSkeleton
                    lines={4}
                    className="max-w-3xl mx-auto"
                  />
                ) : (
                  <>
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-accent">
                      Asociación de Química
                    </h1>
                    <p className="mx-auto max-w-[700px] text-base md:text-xl">
                      La Asociación de Química es una comunidad dedicada a la
                      promoción del estudio, la investigación y la difusión de
                      la química en todas sus ramas. Nos enfocamos en impulsar
                      el conocimiento científico, fomentando el intercambio de
                      ideas y la colaboración entre estudiantes y profesionales
                      del área.
                    </p>
                  </>
                )}
              </div>
              <div className="space-x-4">
                {loading ? (
                  <div className="flex space-x-4">
                    <Skeleton className="h-10 w-28" />
                    <Skeleton className="h-10 w-28" />
                  </div>
                ) : (
                  <>
                    <Button className="bg-base text-white hover:bg-accent rounded-md">
                      <a href="">Únete ahora</a>
                    </Button>
                    <Button
                      variant="outline"
                      className="border-base text-base hover:bg-accent hover:text-white rounded-md"
                    >
                      Saber más
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="w-full py-12 md:py-12 lg:py-14 bg-background"
        >
          <div className="container px-4 md:px-6 mx-auto">
            {loading ? (
              <>
                <TitleSkeleton />
                <FeatureSkeleton count={3} />
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 text-accent">
                  Nuestras Características
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="flex flex-col items-center text-center">
                    <AtomIcon className="h-12 w-12 text-base mb-4" />
                    <h3 className="text-xl font-bold mb-2 text-accent">
                      Investigación Innovadora
                    </h3>
                    <p className="text-base">
                      Fomentamos la investigación avanzada y la innovación en
                      diversas áreas del conocimiento, brindando a nuestros
                      estudiantes universitarios el acceso a recursos y
                      herramientas para desarrollar proyectos.
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <BookOpenIcon className="h-12 w-12 text-base mb-4" />
                    <h3 className="text-xl font-bold mb-2 text-accent">
                      Recursos Educativos
                    </h3>
                    <p className="text-base">
                      Proveemos una amplia gama de recursos educativos diseñados
                      para mejorar la experiencia de aprendizaje de nuestros
                      estudiantes universitarios. Desde materiales didácticos
                      hasta plataformas interactivas.
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <UsersIcon className="h-12 w-12 text-base mb-4" />
                    <h3 className="text-xl font-bold mb-2 text-accent">
                      Networking
                    </h3>
                    <p className="text-base">
                      Creamos espacios de conexión entre estudiantes,
                      profesionales y académicos, donde nuestros estudiantes
                      pueden expandir su red de contactos. Fomentamos la
                      colaboración y el intercambio de ideas.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
        <section id="about" className="w-full bg-tertiary">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center w-full">
            {/* Columna 1 */}
            <div
              className="flex flex-col justify-center space-y-4 w-full"
              style={{ padding: "100px" }}
            >
              {loading ? (
                <TextSectionSkeleton lines={5} />
              ) : (
                <>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-accent">
                    Sobre Nosotros
                  </h2>
                  <p className="text-base md:text-xl">
                    La Asociación de Becados nació con el propósito de dar
                    respuesta a la necesidad de apoyo en el ámbito educativo.
                    Sabemos que la educación es la llave para cambiar vidas, y
                    estamos convencidos de que cada estudiante tiene un
                    potencial único. Nuestra misión es brindar recursos y una
                    red de apoyo a estudiantes que se comprometen con su
                    educación y desean transformar su futuro.
                  </p>
                  <Button className="bg-base text-white hover:bg-accent hover:text-white w-fit rounded-md">
                    Conoce nuestro equipo
                  </Button>
                </>
              )}
            </div>

            {/* Columna 2 */}
            <div className="w-full">
              {!imagesLoaded ? (
                <CarouselSkeleton />
              ) : (
                <AutoCarousel images={images} />
              )}
            </div>
          </div>
        </section>

        {/* Junta directiva */}
        <section
          id="members"
          className="w-full py-12 md:py-12 lg:py-12 bg-background"
        >
          {loading ? (
            <TitleSkeleton />
          ) : (
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 text-accent">
              Nuestra junta directiva
            </h2>
          )}

          <div className="min-h-screen flex items-center justify-center bg-background">
            {!membersLoaded ? (
              <MemberCardSkeleton count={9} />
            ) : (
              <MemberCard cards={cards} />
            )}
          </div>
        </section>

        {/* Contact section */}
        <section
          id="contact"
          className="w-full py-12 md:py-14 lg:py-12 bg-tertiary"
        >
          <div className="container px-4 md:px-6 mx-auto">
            {loading ? (
              <TextSectionSkeleton
                lines={2}
                className="max-w-md mx-auto mb-8"
              />
            ) : (
              <>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-4 text-accent">
                  ¿Tienes alguna pregunta?
                </h2>
                <p className="text-center text-base mb-8 max-w-md mx-auto">
                  Si tienes alguna duda o comentario, no dudes en enviarnos un
                  mensaje. Nos encanta escuchar tus sugerencias y ayudarte con
                  lo que necesites.
                </p>
              </>
            )}
            <div className="max-w-md mx-auto">
              {loading ? (
                <FormSkeleton />
              ) : (
                <form className="space-y-4">
                  <Input placeholder="Tu nombre" />
                  <Input type="email" placeholder="Tu email" />
                  <Input placeholder="Asunto" />
                  <textarea
                    className="w-full h-32 px-3 py-2 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-base"
                    placeholder="Tu mensaje"
                  ></textarea>
                  <Button className="w-full bg-base text-white hover:bg-accent rounded-md">
                    Enviar mensaje
                  </Button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-12 bg-base text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {loading ? (
              // Footer skeletons con diseño mejorado
              Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="space-y-4">
                    <div className="h-6 w-[180px] bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded relative overflow-hidden">
                      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-500/30 to-transparent" />
                    </div>
                    <div className="h-4 w-full bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded relative overflow-hidden">
                      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-500/30 to-transparent" />
                    </div>
                    <div className="h-4 w-full bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded relative overflow-hidden">
                      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-500/30 to-transparent" />
                    </div>
                    <div className="h-4 w-3/4 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded relative overflow-hidden">
                      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-500/30 to-transparent" />
                    </div>
                  </div>
                ))
            ) : (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Asociación de Química
                  </h3>
                  <p className="text-sm">
                    La Asociación de Química es una comunidad dedicada a la
                    promoción del estudio, la investigación y la difusión de la
                    química en todas sus ramas.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4">
                    Enlaces rápidos
                  </h4>
                  <ul className="space-y-2">
                    <li>
                      <a href="#" className="text-sm hover:underline">
                        Inicio
                      </a>
                    </li>
                    <li>
                      <a href="#features" className="text-sm hover:underline">
                        Características
                      </a>
                    </li>
                    <li>
                      <a href="#about" className="text-sm hover:underline">
                        Sobre Nosotros
                      </a>
                    </li>
                    <li>
                      <a href="#contact" className="text-sm hover:underline">
                        Contacto
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4">Contáctanos</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      <span className="text-sm">
                        Universidad del Valle de Guatemala
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      <span className="text-sm">info@example.com</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      <span className="text-sm">+1 555 555 5555</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4">Síguenos</h4>
                  <div className="flex items-center gap-4">
                    <a href="#" className="text-white hover:text-base">
                      <Facebook className="h-6 w-6" />
                    </a>
                    <a href="#" className="text-white hover:text-base">
                      <Twitter className="h-6 w-6" />
                    </a>
                    <a href="#" className="text-white hover:text-base">
                      <Linkedin className="h-6 w-6" />
                    </a>
                    <a href="#" className="text-white hover:text-base">
                      <Instagram className="h-6 w-6" />
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
