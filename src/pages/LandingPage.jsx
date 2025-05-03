import { useState, useEffect } from "react"
import AutoCarousel from "@/components/AutoCarousel"
import MemberCard from "@/components/MemberCard"
import { AtomIcon, BookOpenIcon, UsersIcon, Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu"
import { Link } from "react-router-dom"
import { Check, X, LoaderCircle } from "lucide-react"
import { Skeleton, CarouselSkeleton, MemberCardSkeleton, TextSectionSkeleton, FormSkeleton, FeatureSkeleton, TitleSkeleton } from "@/components/SkeletonsLanding"
import { sendEmailToSelfRequest } from "@/actions/email"
import NavBar from "../components/ui/NavLanding"
import { getColors } from "../actions/personalization"
import { getImages } from "../actions/image"

const Button = ({ children, className, variant = "" }) => (
  <button className={`px-4 py-2 rounded ${className} ${variant === "outline" ? "border border-current" : ""}`}>
    {children}
  </button>
)

const Input = ({ placeholder, type = "text", onChange, value }) => (
  <input type={type} onChange={onChange} placeholder={placeholder} value={value} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-base" />
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
    colors: {}, // Inicialmente vacío
    images: {}, // Otros datos del tema
  });

  const fetchCarouselImages = async () => {
    setLoading(true);
    try {
      const [error, images] = await getImages();
      if (error) {
        console.error("Error fetching images:", error);
        setLoading(false);
        return;
      }

      // Filtra solo las imágenes de tipo "Carrousel"
      const carouselImages = images.filter((image) => image.tipo === "Carrousel");

      // Actualiza el estado con las imágenes del carrusel
      setTheme((prevTheme) => ({
        ...prevTheme,
        images: carouselImages,
      }));

      console.log("Fetched carousel images:", carouselImages); // Verifica las imágenes obtenidas
    } catch (err) {
      console.error("Unexpected error fetching images:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchColors = async () => {
    setLoading(true)
    const [error, colors] = await getColors()
    if (error) {
      console.error("Error fetching colors:", error)
      setLoading(false)
      return
    }
    const formattedColors = Object.fromEntries(
      colors.map((color) => [color.nombre, color.hex])
    )
    setTheme((prevTheme) => ({
      ...prevTheme,
      colors: formattedColors,
    }))
    console.log("Fetched colors:", formattedColors) // Verifica los colores aquí
    setLoading(false)
  }

  useEffect(() => {
    fetchColors();
    fetchCarouselImages();
  }, [])

  useEffect(() => {
    const loadMembers = async () => {
      const mockData = [
        { name: "José Paíz", role: "Presidente", avatar: "https://iili.io/3AwWVII.md.png", bio: "Founder and CEO with 15 years of experience in the industry.", contact: { email: "maria@example.com", phone: "+1234567890" } },
        { name: "Eduardo Quiñónez", role: "Vocal de comunicación", avatar: "https://iili.io/3AwWa1a.png", bio: "Founder and CEO with 15 years of experience in the industry.", contact: { email: "maria@example.com", phone: "+1234567890" } },
        { name: "Valeria Sierra", role: "Vicepresidente", avatar: "https://iili.io/3AwXT3G.md.png", bio: "Founder and CEO with 15 years of experience in the industry.", contact: { email: "maria@example.com", phone: "+1234567890" } },
        { name: "Carmen Lizama", role: "Vocal de proyectos", avatar: "https://iili.io/3AwXWyQ.md.png", bio: "Founder and CEO with 15 years of experience in the industry.", contact: { email: "maria@example.com", phone: "+1234567890" } },
        { name: "Luis Avila", role: "Vocal de bienestar estudiantil", avatar: "https://iili.io/3AwW0dv.md.png", bio: "Founder and CEO with 15 years of experience in the industry.", contact: { email: "maria@example.com", phone: "+1234567890" } },
        { name: "Arturo Joachín", role: "Tesorero", avatar: "https://iili.io/3AwXuaf.md.png", bio: "Founder and CEO with 15 years of experience in the industry.", contact: { email: "maria@example.com", phone: "+1234567890" } },
        { name: "Juan Pablo León", role: "Vocal académico", avatar: "https://iili.io/3AwW17R.md.png", bio: "Founder and CEO with 15 years of experience in the industry.", contact: { email: "maria@example.com", phone: "+1234567890" } },
        { name: "Mijaél Juárez", role: "Vocal de innovación", avatar: "https://iili.io/3AwX3Yv.md.png", bio: "Founder and CEO with 15 years of experience in the industry.", contact: { email: "maria@example.com", phone: "+1234567890" } },
        { name: "Andrea Arévalo", role: "Vocal de redes sociales", avatar: "https://iili.io/3AwXAv4.md.png", bio: "Founder and CEO with 15 years of experience in the industry.", contact: { email: "maria@example.com", phone: "+1234567890" } },
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
    <div className="flex flex-col min-h-screen bg-white">
      <NavBar />
      <main className="flex-1 pt-16">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48" style={{ backgroundColor: theme.colors.Tertiary }}>
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                {loading ? (
                  <TextSectionSkeleton lines={4} className="max-w-3xl mx-auto" />
                ) : (
                  <>
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-7 md:text-5xl lg:text-6xl/none" style={{ color: theme.colors.Accent }}>Asociación de Química</h1>
                    <p className="mx-auto max-w-[900px] md:text-xl" style={{ color: theme.colors.Primary }}>La Asociación de Química es una comunidad dedicada a la promoción del estudio, la investigación y la difusión de la química en todas sus ramas. Nos enfocamos en impulsar el conocimiento científico, fomentando el intercambio de ideas y la colaboración entre estudiantes y profesionales del área.</p>
                  </>
                )}
              </div>
              <div className="space-x-4">
                {loading && (
                  <div className="flex space-x-4">
                    <Skeleton className="h-10 w-28" />
                    <Skeleton className="h-10 w-28" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-12 lg:py-14" style={{ backgroundColor: theme.colors.Background }}>
          <div className="container px-4 md:px-6 mx-auto">
            {loading ? (
              <>
                <TitleSkeleton />
                <FeatureSkeleton count={3} />
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8" style={{ color: theme.colors.Accent }}>Nuestras Características</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="flex flex-col items-center text-center">
                    <AtomIcon className="h-12 w-12 mb-4" style={{ color: theme.colors.Primary }} />
                    <h3 className="text-xl font-bold mb-2" style={{ color: theme.colors.Accent }}>Investigación Innovadora</h3>
                    <p style={{ color: theme.colors.Primary }}>Fomentamos la investigación avanzada y la innovación en diversas áreas del conocimiento, brindando a nuestros estudiantes universitarios el acceso a recursos y herramientas para desarrollar proyectos.</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <BookOpenIcon className="h-12 w-12 mb-4" style={{ color: theme.colors.Primary }} />
                    <h3 className="text-xl font-bold mb-2" style={{ color: theme.colors.Accent }}>Recursos Educativos</h3>
                    <p style={{ color: theme.colors.Primary }}>Proveemos una amplia gama de recursos educativos diseñados para mejorar la experiencia de aprendizaje de nuestros estudiantes universitarios. Desde materiales didácticos hasta plataformas interactivas.</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <UsersIcon className="h-12 w-12 mb-4" style={{ color: theme.colors.Primary }} />
                    <h3 className="text-xl font-bold mb-2" style={{ color: theme.colors.Accent }}>Networking</h3>
                    <p style={{ color: theme.colors.Primary }}>Creamos espacios de conexión entre estudiantes, profesionales y académicos, donde nuestros estudiantes pueden expandir su red de contactos. Fomentamos la colaboración y el intercambio de ideas.</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
        <section id="about" className="w-full" style={{ backgroundColor: theme.colors.Tertiary }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center w-full">
            <div className="flex flex-col justify-center space-y-4 w-full" style={{ padding: "100px" }}>
              {loading ? (
                <TextSectionSkeleton lines={5} />
              ) : (
                <>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl" style={{ color: theme.colors.Accent }}>Sobre Nosotros</h2>
                  <p className="md:text-xl" style={{ color: theme.colors.Primary }}>
                    La Asociación de Química nació con el propósito de dar respuesta a la necesidad de apoyo en el ámbito educativo. Sabemos que la educación es la llave para cambiar vidas, y estamos convencidos de que cada estudiante tiene un potencial único. Nuestra misión es brindar recursos y una red de apoyo a estudiantes que se comprometen con su educación y desean transformar su futuro.
                  </p>
                </>
              )}
            </div>
            <div className="w-full">
              {!loading && theme.images.length > 0 ? (
                <AutoCarousel images={theme.images.map((img) => img.enlace)} />
              ) : (
                <CarouselSkeleton />
              )}
            </div>
          </div>
        </section>
        <section id="members" className="w-full py-12 md:py-12 lg:py-12" style={{ backgroundColor: theme.colors.Background }}>
          {loading ? <TitleSkeleton /> : <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12" style={{ color: theme.colors.Accent }}>Nuestra junta directiva</h2>}
          <div className="flex items-center justify-center" style={{ backgroundColor: theme.colors.Background }}>{!membersLoaded ? <MemberCardSkeleton count={9} /> : <MemberCard cards={cards} />}</div>
        </section>
        <ContactSection loading={loading} />
      </main>
      <footer className="w-full py-12 text-white" style={{ backgroundColor: theme.colors.Primary }}>
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
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
                  <h3 className="text-lg font-semibold mb-4">Asociación de Química</h3>
                  <p className="text-sm">La Asociación de Química es una comunidad dedicada a la promoción del estudio, la investigación y la difusión de la química en todas sus ramas.</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4">Enlaces rápidos</h4>
                  <ul className="space-y-2">
                    <li><a href="#" onClick={(e) => handleSmoothScroll(e, "#")} className="text-sm hover:underline">Inicio</a></li>
                    <li><a href="#features" onClick={(e) => handleSmoothScroll(e, "#features")} className="text-sm hover:underline">Características</a></li>
                    <li><a href="#about" onClick={(e) => handleSmoothScroll(e, "#about")} className="text-sm hover:underline">Sobre Nosotros</a></li>
                    <li><a href="#contact" onClick={(e) => handleSmoothScroll(e, "#contact")} className="text-sm hover:underline">Contacto</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4">Contáctanos</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2"><MapPin className="h-5 w-5" /><span className="text-sm">Universidad del Valle de Guatemala</span></li>
                    <li className="flex items-center gap-2"><Mail className="h-5 w-5" /><span className="text-sm">info@example.com</span></li>
                    <li className="flex items-center gap-2"><Phone className="h-5 w-5" /><span className="text-sm">+1 555 555 5555</span></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4">Síguenos</h4>
                  <div className="flex items-center gap-4">
                    <a href="#" className="text-white hover:scale-110 transition-transform"><Facebook className="h-6 w-6" /></a>
                    <a href="#" className="text-white hover:scale-110 transition-transform"><Twitter className="h-6 w-6" /></a>
                    <a href="#" className="text-white hover:scale-110 transition-transform"><Linkedin className="h-6 w-6" /></a>
                    <a href="#" className="text-white hover:scale-110 transition-transform"><Instagram className="h-6 w-6" /></a>
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

function ContactSection({ loading }) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [loading1, setLoading] = useState(true);

  const [theme, setTheme] = useState({
    colors: {}, // Inicialmente vacío
    images: {}, // Otros datos del tema
  });

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
  }, []);

  const sendEmail = async (e) => {
    try {
      e.preventDefault();
      if (status !== "idle") return;
      setStatus("loading");
      const [error] = await sendEmailToSelfRequest({
        name: form.name,
        subject: form.subject,
        message: form.message,
        email: form.email,
      });
      if (error) throw error;
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    } finally {
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <section
      id="contact"
      className="w-full py-12 md:py-14 lg:py-12"
      style={{ backgroundColor: theme.colors.Tertiary }}
    >
      <div className="container px-4 md:px-6 mx-auto">
        {loading ? (
          <TextSectionSkeleton lines={2} className="max-w-md mx-auto mb-8" />
        ) : (
          <>
            <h2
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-4"
              style={{ color: theme.colors.Accent }}
            >
              ¿Tienes alguna pregunta?
            </h2>
            <p
              className="text-center mb-8 max-w-md mx-auto"
              style={{ color: theme.colors.Primary }}
            >
              Si tienes alguna duda o comentario, no dudes en enviarnos un mensaje. Nos encanta
              escuchar tus sugerencias y ayudarte con lo que necesites.
            </p>
          </>
        )}
        <div className="max-w-md mx-auto">
          {loading ? (
            <FormSkeleton />
          ) : (
            <form onSubmit={sendEmail} className="space-y-4">
              <Input
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                value={form.name}
                placeholder="Tu nombre"
              />
              <Input
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                type="email"
                value={form.email}
                placeholder="Tu email"
              />
              <Input
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                value={form.subject}
                placeholder="Asunto"
              />
              <textarea
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                value={form.message}
                className="w-full h-32 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-base" style={{ color: theme.colors.Primary }}
                placeholder="Tu mensaje"
              ></textarea>
              <Button
                className="w-full text-white rounded-md flex gap-3 items-center justify-center"
                style={{
                  backgroundColor: theme.colors.Accent,
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = theme.colors.Primary)
                } // Cambia el color al hacer hover
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = theme.colors.Accent)
                } // Restaura el color al salir del hover
              >
                {status === "idle" && <span>Enviar</span>}
                {status === "loading" && (
                  <>
                    <span>Enviando</span>
                    <LoaderCircle className="animate-spin" />
                  </>
                )}
                {status === "success" && (
                  <>
                    <span>Enviado</span>
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
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default LandingPage