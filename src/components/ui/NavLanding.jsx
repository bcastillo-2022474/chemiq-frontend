import { useState } from "react";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/SkeletonsLanding"; // Asegúrate de que esta importación sea correcta
import { Button } from "@/components/ui/Button"; // Asumo que tienes un componente Button definido

const NavBar = ({ loading }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-base shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              {loading ? (
                <Skeleton className="w-[150px] h-[50px]" />
              ) : (
                <span className="text-2xl font-bold text-white">
                  <img
                    src="https://iili.io/3Awgque.jpg"
                    alt="Logo"
                    className="w-full h-[50px]"
                  />
                </span>
              )}
            </div>

            {/* Menú para pantallas grandes */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-lime-600">
                      Proyectos Destacados
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-4 md:w-[400px] bg-background lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                        <li className="row-span-3">
                          <NavigationMenuLink asChild>
                            <a
                              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-lime-500 to-lime-600 p-6 no-underline outline-none focus:shadow-md"
                              href="/"
                            >
                              <div className="mt-4 text-lg font-medium text-white">
                                BioDiesel
                              </div>
                              <p className="text-sm leading-tight text-white/90">
                                La producción de biodiésel: una alternativa viable de reciclaje y una oportunidad de aprendizaje
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
                              <div className="text-sm font-medium leading-none">Satelite Quetzal 1</div>
                              <p className="line-clamp-2 text-sm leading-snug text-gray-500">
                                El primer satélite guatemalteco
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
                              <div className="text-sm font-medium leading-none">Proyecto X</div>
                              <p className="line-clamp-2 text-sm leading-snug text-gray-500">Proyecto X</p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <a
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-lime-100 focus:bg-lime-100"
                              href="/"
                            >
                              <div className="text-sm font-medium leading-none">Proyecto X</div>
                              <p className="line-clamp-2 text-sm leading-snug text-gray-500">Proyecto X</p>
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
                      Conócenos
                    </a>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          {/* Botón de login para pantallas grandes */}
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
              {loading ? (
                <Skeleton className="h-10 w-28" />
              ) : (
                <Link to="/login">
                  <Button
                    variant="quimica"
                    className="text-lime-700 bg-white hover:bg-accent hover:text-white rounded-md font-semibold w-full"
                  >
                    Iniciar sesión
                  </Button>
                </Link>
              )}
              {/* Menú de proyectos destacados en móviles */}
              {/* <div className="pt-2">
                <span className="text-lime-600 px-3 py-2 text-sm font-medium">Proyectos Destacados</span>
                <div className="pl-4 space-y-2">
                  <a href="/" className="block text-white hover:text-lime-200 px-3 py-2 rounded-md text-sm">
                    BioDiesel
                  </a>
                  <a href="/" className="block text-white hover:text-lime-200 px-3 py-2 rounded-md text-sm">
                    Satélite Quetzal 1
                  </a>
                  <a href="/" className="block text-white hover:text-lime-200 px-3 py-2 rounded-md text-sm">
                    Proyecto X
                  </a>
                  <a href="/" className="block text-white hover:text-lime-200 px-3 py-2 rounded-md text-sm">
                    Proyecto X
                  </a>
                </div>
              </div> */}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;