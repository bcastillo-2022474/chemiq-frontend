import React from 'react';
import AutoCarousel from '../components/AutoCarousel';
import {
  BeakerIcon,
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
} from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const Button = ({ children, className, variant }) => (
  <button
    className={`px-4 py-2 rounded ${className} ${variant === 'outline' ? 'border border-current' : ''
      }`}
  >
    {children}
  </button>
);

const Input = ({ placeholder, type = 'text' }) => (
  <input
    type={type}
    placeholder={placeholder}
    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-base"
  />
);

const images = [
  'https://www.subexpuesta.com/img/content/paisajes-naturales_1.webp',
  'https://greenecoera.com/wp-content/uploads/img/img/img/paisaje-naturales.jpg',
];

const MemberCard = ({ image, title, cargo}) => {
  return (
    <Card className="w-[350px] h-[450px] p-0 bg-tertiary shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="p-0">
        <img
          src={image}
          className="w-full h-[300px] object-cover p-0"
        />
      </CardHeader>
      <CardContent className="w-full h-[85px] flex justify-center items-center border-b-4 border-b-accent p-2">
        <h2 className="text-center text-accent text-[25px] font-bold">
          {title}
        </h2>
      </CardContent>
      <CardFooter className="w-full h-[85px] flex  items-center mx-auto">
        <h2 className="text-center text-accent text-[20px] font-bold">
          {cargo}
        </h2>
      </CardFooter>
    </Card>

  );
};

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white ">
      <nav className="bg-base shadow-md ">
        <div className="max-w-7xl mx-auto px-4  sm:px-6 lg:px-8 ">
          <div className="flex justify-between h-16 ">
            <div className="flex ">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-white "><img src="../assets/img/ChemiqLogo.png" /></span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8 ">
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem >
                      <NavigationMenuTrigger className="text-lime-600 ">Productos</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid gap-3 p-4 md:w-[400px] bg-background lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                          <li className="row-span-3 ">
                            <NavigationMenuLink asChild>
                              <a
                                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-lime-500 to-lime-600 p-6 no-underline outline-none focus:shadow-md"
                                href="/"
                              >
                                <div className="mt-4 text-lg font-medium text-white">
                                  Producto Destacado
                                </div>
                                <p className="text-sm leading-tight text-white/90">
                                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
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
                                <div className="text-sm font-medium leading-none">Producto A</div>
                                <p className="line-clamp-2 text-sm leading-snug text-gray-500">
                                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
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
                                <div className="text-sm font-medium leading-none">Producto B</div>
                                <p className="line-clamp-2 text-sm leading-snug text-gray-500">
                                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                </p>
                              </a>
                            </NavigationMenuLink>
                          </li>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <a href="#about" className="text-white hover:text-lime-200 px-3 py-2 rounded-md text-sm font-medium">
                        Acerca de
                      </a>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <a href="#contact" className="text-white hover:text-lime-200 px-3 py-2 rounded-md text-sm font-medium">
                        Contacto
                      </a>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <a href="#members" className="text-white hover:text-lime-200 px-3 py-2 rounded-md text-sm font-medium">
                        Conocenos
                      </a>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Button variant="outline" className="mr-2 text-lime-600 border-white bg-white hover:bg-lime-700">Iniciar sesión</Button>
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <Button variant="ghost" className="text-white">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-accent">
                  Asociación de Química
                </h1>
                <p className="mx-auto max-w-[700px] text-base md:text-xl">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="bg-base text-white hover:bg-accent">Únete ahora</Button>
                <Button
                  variant="outline"
                  className="border-base text-base hover:bg-accent hover:text-white"
                >
                  Saber más
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-12 lg:py-14 bg-background">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 text-accent">
              Nuestras Características
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <AtomIcon className="h-12 w-12 text-base mb-4" />
                <h3 className="text-xl font-bold mb-2 text-accent">Investigación Innovadora</h3>
                <p className="text-base">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <BookOpenIcon className="h-12 w-12 text-base mb-4" />
                <h3 className="text-xl font-bold mb-2 text-accent">Recursos Educativos</h3>
                <p className="text-base">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <UsersIcon className="h-12 w-12 text-base mb-4" />
                <h3 className="text-xl font-bold mb-2 text-accent">Networking</h3>
                <p className="text-base">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="about" className="w-full bg-tertiary">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center w-full">
            {/* Columna 1 */}
            <div className="flex flex-col justify-center space-y-4 w-full" style={{ padding: '100px' }}>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-accent">
                Sobre Nosotros
              </h2>
              <p className="text-base md:text-xl">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <Button className="bg-base text-white hover:bg-blue-700 w-fit">Conoce nuestro equipo</Button>
            </div>

            {/* Columna 2 */}
            <div className="w-full">
              <AutoCarousel images={images} />
            </div>
          </div>
        </section>


        <section id="members" className="w-full py-12 md:py-12 lg:py-12 bg-background">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 text-accent">
            Nuestros miembros
          </h2>
          <div className="App flex items-center justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              <MemberCard
                image="https://uvggt-my.sharepoint.com/:i:/r/personal/are24708_uvg_edu_gt/Documents/Fotos%20Equipo/Jos%C3%A9%20Paiz.png?csf=1&web=1&e=IBJsiC"
                title="José Pablo Paiz Hernández"
                cargo="cargo: Presidente"
              />

              <MemberCard
                image="https://uvggt-my.sharepoint.com/:i:/r/personal/are24708_uvg_edu_gt/Documents/Fotos%20Equipo/Eduardo.png?csf=1&web=1&e=hJXqoy"
                title="Eduardo José Quiñónez Ovando"
                cargo="cargo:"
              />

              <MemberCard
                image="https://uvggt-my.sharepoint.com/:i:/r/personal/are24708_uvg_edu_gt/Documents/Fotos%20Equipo/Valeria.png?csf=1&web=1&e=cvsReb"
                title="Valeria Fernanda Sierra Cano"
                cargo="cargo:"
              />
              <MemberCard
                image="https://uvggt-my.sharepoint.com/:i:/r/personal/are24708_uvg_edu_gt/Documents/Fotos%20Equipo/Carmen.png?csf=1&web=1&e=SSyP5r"
                title="Carmen Sofía Lizama de la Cruz"
                cargo="cargo:"
              />
              <MemberCard
                image="https://uvggt-my.sharepoint.com/:i:/r/personal/are24708_uvg_edu_gt/Documents/Fotos%20Equipo/Luis.png?csf=1&web=1&e=SuHsHc"
                title="Luis Pablo Avila Alvarado"
                cargo="cargo:"
              />
              <MemberCard
                image="https://uvggt-my.sharepoint.com/:i:/r/personal/are24708_uvg_edu_gt/Documents/Fotos%20Equipo/Arturo.png?csf=1&web=1&e=aa9nwG"
                title="Arturo René Joachín de León"
                cargo="cargo:"
              />
              <MemberCard
                image="https://uvggt-my.sharepoint.com/:i:/r/personal/are24708_uvg_edu_gt/Documents/Fotos%20Equipo/JuanPa.png?csf=1&web=1&e=MCmEA7"
                title="Juan Pablo León Serrano"
                cargo="cargo:"
              />
              <MemberCard
                image="https://uvggt-my.sharepoint.com/:i:/r/personal/are24708_uvg_edu_gt/Documents/Fotos%20Equipo/Mijael.png?csf=1&web=1&e=f2LG8x"
                title="Mijael Roberto Juárez Monzón"
                cargo="cargo:"               
              />
              <MemberCard
                image="https://uvggt-my.sharepoint.com/:i:/r/personal/are24708_uvg_edu_gt/Documents/Fotos%20Equipo/Andrea.png?csf=1&web=1&e=YQLIEl"
                title="Andrea Ximena Arévalo Lopez"
                cargo="cargo:"
              />
            </div>
          </div>
        </section>
        <section id="contact" className="w-full py-12 md:py-14 lg:py-12 bg-tertiary">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-4 text-accent">
              Contáctanos
            </h2>
            <p className="text-center text-base mb-8 max-w-md mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="max-w-md mx-auto">
              <form className="space-y-4">
                <Input placeholder="Tu nombre" />
                <Input type="email" placeholder="Tu email" />
                <Input placeholder="Asunto" />
                <textarea
                  className="w-full h-32 px-3 py-2 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-base"
                  placeholder="Tu mensaje"
                ></textarea>
                <Button className="w-full bg-base text-white hover:bg-accent">Enviar mensaje</Button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-12 bg-base text-white"> {/* Footer color */}
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Asociación de Química</h3>
              <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Enlaces rápidos</h4>
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
                  <span className="text-sm">Calle Falsa 123</span>
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
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
