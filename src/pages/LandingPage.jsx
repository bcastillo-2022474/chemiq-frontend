"use client"

import { useState, useEffect } from "react"
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
  MapPin,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import { Check, X, LoaderCircle } from "lucide-react"
import {
  Skeleton,
  CarouselSkeleton,
  MemberCardSkeleton,
  TextSectionSkeleton,
  FormSkeleton,
  FeatureSkeleton,
  TitleSkeleton,
} from "@/components/SkeletonsLanding"
import { sendEmailToSelfRequest } from "@/actions/email"
import NavBar from "../components/ui/NavLanding"
import { getColors } from "../actions/personalization"
import { getImages } from "../actions/image"
import { ColorsProvider } from "../components/colorProvider"

const Button = ({ children, className, variant = "", ...props }) => (
  <button
    className={`
      group relative overflow-hidden px-8 py-4 rounded-xl font-semibold text-lg
      transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-2xl
      ${
        variant === "outline"
          ? "border-2 border-current bg-transparent hover:bg-current hover:text-white"
          : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
      }
      ${className}
    `}
    {...props}
  >
    <span className="relative z-10 flex items-center gap-2">
      {children}
      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
    </span>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
  </button>
)

const Input = ({ placeholder, type = "text", onChange, value, theme }) => (
  <div className="relative group">
    <input
      type={type}
      onChange={onChange}
      placeholder={placeholder}
      value={value}
      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-lg placeholder-gray-400"
      style={{
        color: theme?.colors?.Tertiary || "#5f5f5f",
      }}
    />
    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
  </div>
)

const handleSmoothScroll = (e, targetId) => {
  e.preventDefault()
  const targetElement = document.querySelector(targetId)
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: "smooth" })
  }
}

const LandingPage = () => {
  const [loading, setLoading] = useState(true)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [membersLoaded, setMembersLoaded] = useState(false)
  const [cards, setCards] = useState([])
  const [theme, setTheme] = useState({
    colors: {},
    images: {},
  })

  const fetchCarouselImages = async () => {
    setLoading(true)
    try {
      const [error, images] = await getImages()
      if (error) {
        console.error("Error fetching images:", error)
        setLoading(false)
        return
      }

      const carouselImages = images.filter((image) => image.tipo === "Carrousel")

      setTheme((prevTheme) => ({
        ...prevTheme,
        images: carouselImages,
      }))

      console.log("Fetched carousel images:", carouselImages)
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
    console.log("Fetched colors:", formattedColors)
    setLoading(false)
  }

  useEffect(() => {
    fetchColors()
    fetchCarouselImages()
  }, [])

  useEffect(() => {
    const loadMembers = async () => {
      const mockData = [
        {
          name: "José Paíz",
          role: "Presidente",
          avatar: "https://iili.io/3AwWVII.md.png",
          bio: "Founder and CEO with 15 years of experience in the industry.",
          contact: { email: "maria@example.com", phone: "+1234567890" },
        },
        {
          name: "Eduardo Quiñónez",
          role: "Vocal de comunicación",
          avatar: "https://iili.io/3AwWa1a.png",
          bio: "Founder and CEO with 15 years of experience in the industry.",
          contact: { email: "maria@example.com", phone: "+1234567890" },
        },
        {
          name: "Valeria Sierra",
          role: "Vicepresidente",
          avatar: "https://iili.io/3AwXT3G.md.png",
          bio: "Founder and CEO with 15 years of experience in the industry.",
          contact: { email: "maria@example.com", phone: "+1234567890" },
        },
        {
          name: "Carmen Lizama",
          role: "Vocal de proyectos",
          avatar: "https://iili.io/3AwXWyQ.md.png",
          bio: "Founder and CEO with 15 years of experience in the industry.",
          contact: { email: "maria@example.com", phone: "+1234567890" },
        },
        {
          name: "Luis Avila",
          role: "Vocal de bienestar estudiantil",
          avatar: "https://iili.io/3AwW0dv.md.png",
          bio: "Founder and CEO with 15 years of experience in the industry.",
          contact: { email: "maria@example.com", phone: "+1234567890" },
        },
        {
          name: "Arturo Joachín",
          role: "Tesorero",
          avatar: "https://iili.io/3AwXuaf.md.png",
          bio: "Founder and CEO with 15 years of experience in the industry.",
          contact: { email: "maria@example.com", phone: "+1234567890" },
        },
        {
          name: "Juan Pablo León",
          role: "Vocal académico",
          avatar: "https://iili.io/3AwW17R.md.png",
          bio: "Founder and CEO with 15 years of experience in the industry.",
          contact: { email: "maria@example.com", phone: "+1234567890" },
        },
        {
          name: "Mijaél Juárez",
          role: "Vocal de innovación",
          avatar: "https://iili.io/3AwX3Yv.md.png",
          bio: "Founder and CEO with 15 years of experience in the industry.",
          contact: { email: "maria@example.com", phone: "+1234567890" },
        },
        {
          name: "Andrea Arévalo",
          role: "Vocal de redes sociales",
          avatar: "https://iili.io/3AwXAv4.md.png",
          bio: "Founder and CEO with 15 years of experience in the industry.",
          contact: { email: "maria@example.com", phone: "+1234567890" },
        },
      ]
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setCards(mockData)
      setMembersLoaded(true)
    }

    loadMembers()
    const imageTimer = setTimeout(() => setImagesLoaded(true), 2000)
    const memberTimer = setTimeout(() => setMembersLoaded(true), 2500)
    const loadingTimer = setTimeout(() => setLoading(false), 3000)

    return () => {
      clearTimeout(imageTimer)
      clearTimeout(memberTimer)
      clearTimeout(loadingTimer)
    }
  }, [])

  return (
    <div
      className="flex flex-col min-h-screen relative overflow-hidden"
      style={{ backgroundColor: theme.colors.Background || "#fff8f0" }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-red-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-200/20 to-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-yellow-200/10 to-orange-200/10 rounded-full blur-3xl" />
      </div>

      <ColorsProvider>
        <NavBar />
        <main className="flex-1 pt-16 relative z-10">
          {/* Hero Section */}
          <section
            className="w-full py-20 md:py-32 lg:py-40 xl:py-56 relative"
            style={{ backgroundColor: theme.colors.Tertiary || "#fff8f0" }}
          >
            <div className="container px-4 md:px-6 mx-auto relative">
              <div className="flex flex-col items-center space-y-8 text-center">
                <div className="space-y-6 max-w-5xl">
                  {loading ? (
                    <TextSectionSkeleton lines={4} className="max-w-3xl mx-auto" />
                  ) : (
                    <>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 text-sm font-medium mb-6">
                        <Sparkles className="w-4 h-4" />
                        Bienvenidos a la comunidad científica
                      </div>
                      <h1
                      className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent leading-tight"
                      style={{ color: theme.colors.Secondary || "#505050" }}
                      >
                      Asociación de
                      <span
                        className="block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent"
                        style={{
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        textFillColor: "transparent",
                        paddingBottom: "0.10em",
                        lineHeight: 1.1,
                        // Fix for descenders being clipped
                        WebkitBoxDecorationBreak: "clone",
                        boxDecorationBreak: "clone",
                        display: "inline-block",
                        }}
                      >
                        Ingenieria Química
                        <span style={{ display: "inline-block", height: "0.3em", verticalAlign: "bottom" }}>&nbsp;</span>
                      </span>
                      </h1>
                      <p
                        className="mx-auto max-w-4xl text-xl md:text-2xl leading-relaxed font-light"
                        style={{ color: theme.colors.Secondary || "#5f5f5f" }}
                      >
                        Una comunidad dedicada a la promoción del estudio, la investigación y la difusión de la química
                        en todas sus ramas. Impulsamos el conocimiento científico, fomentando el intercambio de ideas y
                        la colaboración entre estudiantes y profesionales.
                      </p>
                    </>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-6 pt-8">
                  {loading ? (
                    <div className="flex flex-col sm:flex-row gap-6">
                      <Skeleton className="h-14 w-40" />
                      <Skeleton className="h-14 w-40" />
                    </div>
                  ) : (
                    <>
                      <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                        Únete Ahora
                      </Button>
                      <Button
                        variant="outline"
                        className="border-2 border-gray-300 text-gray-700 hover:bg-gray-700 hover:text-white"
                      >
                        Conoce Más
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section
            id="features"
            className="w-full py-20 md:py-24 lg:py-28 relative"
            style={{ backgroundColor: theme.colors.Background || "#fff8f0" }}
          >
            <div className="container px-4 md:px-6 mx-auto">
              {loading ? (
                <>
                  <TitleSkeleton />
                  <FeatureSkeleton count={3} />
                </>
              ) : (
                <>
                  <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-medium mb-6">
                      <AtomIcon className="w-4 h-4" />
                      Nuestras Fortalezas
                    </div>
                    <h2
                      className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                      style={{ color: theme.colors.Accent || "#505050" }}
                    >
                      Características Destacadas
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                      Descubre lo que nos hace únicos en el mundo de la química y la investigación científica
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                    {[
                      {
                        icon: AtomIcon,
                        title: "Investigación Innovadora",
                        description:
                          "Fomentamos la investigación avanzada y la innovación en diversas áreas del conocimiento, brindando a nuestros estudiantes universitarios el acceso a recursos y herramientas para desarrollar proyectos.",
                        gradient: "from-orange-500 to-red-500",
                      },
                      {
                        icon: BookOpenIcon,
                        title: "Recursos Educativos",
                        description:
                          "Proveemos una amplia gama de recursos educativos diseñados para mejorar la experiencia de aprendizaje de nuestros estudiantes universitarios. Desde materiales didácticos hasta plataformas interactivas.",
                        gradient: "from-blue-500 to-purple-500",
                      },
                      {
                        icon: UsersIcon,
                        title: "Networking",
                        description:
                          "Creamos espacios de conexión entre estudiantes, profesionales y académicos, donde nuestros estudiantes pueden expandir su red de contactos. Fomentamos la colaboración y el intercambio de ideas.",
                        gradient: "from-green-500 to-teal-500",
                      },
                    ].map((feature, index) => (
                      <div key={index} className="group relative">
                        <div
                          className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl blur-xl"
                          style={{
                            background: `linear-gradient(135deg, ${feature.gradient.split(" ")[1]}, ${feature.gradient.split(" ")[3]})`,
                          }}
                        />
                        <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                          <div
                            className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.gradient} mb-6 shadow-lg`}
                          >
                            <feature.icon className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                          <p className="text-gray-600 leading-relaxed text-lg">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>

          {/* About Section */}
          <section
            id="about"
            className="w-full relative overflow-hidden"
            style={{ backgroundColor: theme.colors.Tertiary || "#5f5f5f" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-gray-800/50" />
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center w-full relative z-10">
              <div className="flex flex-col justify-center space-y-8 px-8 md:px-16 lg:px-20 py-20 lg:py-32">
                {loading ? (
                  <TextSectionSkeleton lines={5} />
                ) : (
                  <>
                    <div className="space-y-6">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium">
                        <Sparkles className="w-4 h-4" />
                        Nuestra Historia
                      </div>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                      Sobre{" "}
                      <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                        Nosotros
                      </span>
                      </h2>
                      <p className="text-xl md:text-2xl leading-relaxed text-gray-200 font-light">
                        La Asociación de Química nació con el propósito de dar respuesta a la necesidad de apoyo en el
                        ámbito educativo. Sabemos que la educación es la llave para cambiar vidas, y estamos convencidos
                        de que cada estudiante tiene un potencial único.
                      </p>
                      <p className="text-lg leading-relaxed text-gray-300">
                        Nuestra misión es brindar recursos y una red de apoyo a estudiantes que se comprometen con su
                        educación y desean transformar su futuro.
                      </p>
                    </div>
                    <div className="pt-4">
                      <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                        Conoce Nuestra Historia
                      </Button>
                    </div>
                  </>
                )}
              </div>
              <div className="w-full relative">
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-gray-900/20 z-10" />
                {!loading && theme.images.length > 0 ? (
                  <div className="relative">
                    <AutoCarousel images={theme.images.map((img) => img.enlace)} />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent" />
                  </div>
                ) : (
                  <CarouselSkeleton />
                )}
              </div>
            </div>
          </section>

          {/* Members Section */}
          <section
            id="members"
            className="w-full py-20 md:py-24 lg:py-28 relative"
            style={{ backgroundColor: theme.colors.Background || "#fff8f0" }}
          >
            <div className="container px-4 md:px-6 mx-auto">
              {loading ? (
                <TitleSkeleton />
              ) : (
                <div className="text-center mb-16">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-sm font-medium mb-6">
                    <UsersIcon className="w-4 h-4" />
                    Nuestro Equipo
                  </div>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Junta Directiva
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Conoce a los líderes que impulsan nuestra visión y compromiso con la excelencia académica
                  </p>
                </div>
              )}
              <div className="flex items-center justify-center">
                {!membersLoaded ? <MemberCardSkeleton count={9} /> : <MemberCard cards={cards} />}
              </div>
            </div>
          </section>

          <ContactSection loading={loading} />
        </main>

        {/* Footer */}
        <footer
          className="w-full py-16 relative overflow-hidden"
          style={{ backgroundColor: theme.colors.Primary || "#fc5000" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-red-600/20" />
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {loading ? (
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
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold mb-6" style={{ color: theme.colors.Secondary || "#e4e4e4" }}>
                      Asociación de Química
                    </h3>
                    <p className="text-lg leading-relaxed" style={{ color: theme.colors.Secondary || "#e4e4e4" }}>
                      Una comunidad dedicada a la promoción del estudio, la investigación y la difusión de la química en
                      todas sus ramas.
                    </p>
                  </div>
                  <div className="space-y-6">
                    <h4 className="text-xl font-bold" style={{ color: theme.colors.Secondary || "#e4e4e4" }}>
                      Enlaces Rápidos
                    </h4>
                    <ul className="space-y-3">
                      {[
                        { href: "#", text: "Inicio" },
                        { href: "#features", text: "Características" },
                        { href: "#about", text: "Sobre Nosotros" },
                        { href: "#contact", text: "Contacto" },
                      ].map((link, index) => (
                        <li key={index}>
                          <a
                            href={link.href}
                            onClick={(e) => handleSmoothScroll(e, link.href)}
                            className="text-lg hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                            style={{ color: theme.colors.Secondary || "#e4e4e4" }}
                          >
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            {link.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-6">
                    <h4 className="text-xl font-bold" style={{ color: theme.colors.Secondary || "#e4e4e4" }}>
                      Contáctanos
                    </h4>
                    <ul className="space-y-4">
                      <li className="flex items-center gap-3 text-lg">
                        <div className="p-2 rounded-lg bg-white/10">
                          <MapPin className="h-5 w-5" style={{ color: theme.colors.Secondary || "#e4e4e4" }} />
                        </div>
                        <span style={{ color: theme.colors.Secondary || "#e4e4e4" }}>
                          Universidad del Valle de Guatemala
                        </span>
                      </li>
                      <li className="flex items-center gap-3 text-lg">
                        <div className="p-2 rounded-lg bg-white/10">
                          <Mail className="h-5 w-5" style={{ color: theme.colors.Secondary || "#e4e4e4" }} />
                        </div>
                        <span style={{ color: theme.colors.Secondary || "#e4e4e4" }}>info@example.com</span>
                      </li>
                      <li className="flex items-center gap-3 text-lg">
                        <div className="p-2 rounded-lg bg-white/10">
                          <Phone className="h-5 w-5" style={{ color: theme.colors.Secondary || "#e4e4e4" }} />
                        </div>
                        <span style={{ color: theme.colors.Secondary || "#e4e4e4" }}>+1 555 555 5555</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-6">
                    <h4 className="text-xl font-bold" style={{ color: theme.colors.Secondary || "#e4e4e4" }}>
                      Síguenos
                    </h4>
                    <div className="flex items-center gap-4">
                      <a
                        href="#"
                        className="group p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                      >
                        <Facebook
                          className="h-6 w-6 transition-colors"
                          style={{ color: theme.colors.Secondary || "#e4e4e4" }}
                        />
                      </a>
                      <a
                        href="#"
                        className="group p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                      >
                        <Twitter
                          className="h-6 w-6 transition-colors"
                          style={{ color: theme.colors.Secondary || "#e4e4e4" }}
                        />
                      </a>
                      <a
                        href="#"
                        className="group p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                      >
                        <Linkedin
                          className="h-6 w-6 transition-colors"
                          style={{ color: theme.colors.Secondary || "#e4e4e4" }}
                        />
                      </a>
                      <a
                        href="https://www.instagram.com/chemiq.uvg/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                      >
                        <Instagram
                          className="h-6 w-6 transition-colors"
                          style={{ color: theme.colors.Secondary || "#e4e4e4" }}
                        />
                      </a>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="mt-12 pt-8 border-t border-white/20 text-center">
              <p className="text-lg" style={{ color: theme.colors.Secondary || "#e4e4e4" }}>
                © 2024 Asociación de Química. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </footer>
      </ColorsProvider>
    </div>
  )
}

function ContactSection({ loading }) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [status, setStatus] = useState("idle")
  const [loading1, setLoading] = useState(true)

  const [theme, setTheme] = useState({
    colors: {},
    images: {},
  })

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
  }, [])

  const sendEmail = async (e) => {
    try {
      e.preventDefault()
      if (status !== "idle") return
      setStatus("loading")
      const [error] = await sendEmailToSelfRequest({
        name: form.name,
        subject: form.subject,
        message: form.message,
        email: form.email,
      })
      if (error) throw error
      setStatus("success")
      setForm({ name: "", email: "", subject: "", message: "" })
    } catch {
      setStatus("error")
    } finally {
      setTimeout(() => setStatus("idle"), 5000)
    }
  }

  return (
    <section
      id="contact"
      className="w-full py-20 md:py-24 lg:py-28 relative overflow-hidden"
      style={{ backgroundColor: theme.colors.Tertiary || "#5f5f5f" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/30 to-gray-800/30" />
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        {loading ? (
          <TextSectionSkeleton lines={2} className="max-w-md mx-auto mb-8" />
        ) : (
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium mb-6">
              <Mail className="w-4 h-4" />
              Contáctanos
            </div>
            <h2 className="text-4xl mb-10 md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              ¿Tienes alguna{" "}
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                pregunta?
              </span>
            </h2>
            <p className="text-xl md:text-2xl leading-relaxed text-gray-200 max-w-3xl mx-auto font-light">
              Si tienes alguna duda o comentario, no dudes en enviarnos un mensaje. Nos encanta escuchar tus sugerencias
              y ayudarte con lo que necesites.
            </p>
          </div>
        )}
        <div className="max-w-2xl mx-auto">
          {loading ? (
            <FormSkeleton />
          ) : (
            <div className="bg-white/10 backdrop-blur-lg p-8 md:p-12 rounded-3xl shadow-2xl border border-white/20">
              <form onSubmit={sendEmail} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    onChange={(e) => setForm((f) => ({ ...f, name: e.currentTarget.value }))}
                    value={form.name}
                    placeholder="Tu nombre"
                    theme={theme}
                  />
                  <Input
                    onChange={(e) => setForm((f) => ({ ...f, email: e.currentTarget.value }))}
                    type="email"
                    value={form.email}
                    placeholder="Tu email"
                    theme={theme}
                  />
                </div>
                <Input
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.currentTarget.value }))}
                  value={form.subject}
                  placeholder="Asunto"
                  theme={theme}
                />
                <div className="relative group">
                  <textarea
                    onChange={(e) => setForm((f) => ({ ...f, message: e.currentTarget.value }))}
                    value={form.message}
                    className="w-full h-40 px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-lg placeholder-gray-400 resize-none"
                    style={{
                      color: theme.colors.Secondary || "#e4e4e4",
                    }}
                    placeholder="Tu mensaje"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
                <Button
                  className="w-full py-6 text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-2xl"
                  disabled={status !== "idle"}
                >
                  {status === "idle" && "Enviar Mensaje"}
                  {status === "loading" && (
                    <>
                      Enviando
                      <LoaderCircle className="animate-spin ml-2" />
                    </>
                  )}
                  {status === "success" && (
                    <>
                      ¡Enviado!
                      <Check className="ml-2" />
                    </>
                  )}
                  {status === "error" && (
                    <>
                      Error
                      <X className="ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default LandingPage
