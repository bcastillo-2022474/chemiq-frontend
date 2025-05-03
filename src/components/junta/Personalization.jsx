"use client"

import { useState, useEffect } from "react"
import { Check, ImageIcon, Palette, Upload } from "lucide-react"
import Swal from "sweetalert2"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { getColors, getColorByIdRequest, updateColorRequest } from "../../actions/personalization"
import { getImages, deleteImageRequest, updateImageRequest, createImageRequest } from "../../actions/image"
// Initial theme structure
const initialTheme = {
  colors: {},
  images: [],
};

export default function Personalization() {
  const [theme, setTheme] = useState(initialTheme)
  const [activeTab, setActiveTab] = useState("colors")
  const [activeColor, setActiveColor] = useState(null)
  const [activeImage, setActiveImage] = useState(null)
  const [imageUrl, setImageUrl] = useState("")
  const [imageName, setImageName] = useState("");
  const [loading, setLoading] = useState(true)
  const carrouselImages = theme.images.filter((image) => image.tipo === "Carrousel");
  const logoImage = theme.images.find((image) => image.tipo === "Logo");
  const LoginBanner = theme.images.find((image) => image.tipo === "LoginBanner");
  const colorOrder = ["Primary", "Secondary", "Tertiary", "Accent", "Background"];
  // Fetch colors from the database
  const fetchImages = async () => {
    setLoading(true);
    try {
      const [error, images] = await getImages();
      console.log("Response from getImages:", images);
      if (error) {
        console.error("Error fetching images:", error);
        setLoading(false);
        return;
      }

      setTheme((prevTheme) => ({
        ...prevTheme,
        images: Array.isArray(images) ? images : [],
      }));
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
    setLoading(false)
  }

  useEffect(() => {
    fetchColors()
    fetchImages()
  }, [])

  // Update a specific color
  const updateColor = (nombre, hex) => {
    setTheme((prevTheme) => ({
      ...prevTheme,
      colors: {
        ...prevTheme.colors,
        [nombre]: hex,
      },
    }));
  };
  const addCarouselImage = (url, nombre) => {
    setTheme((prevTheme) => ({
      ...prevTheme,
      images: [
        ...prevTheme.images,
        { tipo: "Carrousel", enlace: url, nombre },
      ],
    }));
  };
  const saveColors = async () => {
    try {
      const colors = theme.colors;
      const promises = Object.entries(colors).map(([nombre, hex]) =>
        updateColorRequest({ nombre, color: { hex } })
      );

      const results = await Promise.all(promises);


      const errors = results.filter(([error]) => error);
      if (errors.length > 0) {
        void Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron guardar algunos colores.",
        });
        return;
      }

      void Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Colores actualizados correctamente.",
      });
    } catch (err) {
      console.error("Error inesperado al guardar colores:", err);
      void Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error inesperado al guardar los colores.",
      });
    }
  };
  const cancelChanges = () => {
    fetchColors();
    fetchImages();
    setTheme(initialTheme);
    setActiveColor(null);
    setImageUrl("");
  };
  const handleImageClick = (id) => {
    const imageToDelete = theme.images.find((image) => image.id === id);

    if (!imageToDelete) {
      console.error("No se encontró la imagen con el ID:", id);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se encontró la imagen seleccionada.",
      });
      return;
    }

    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la imagen de forma permanente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          console.log("Eliminando imagen con ID:", imageToDelete.id);
          await deleteImageRequest(imageToDelete.id);

          // Elimina la imagen del estado local
          setTheme((prevTheme) => ({
            ...prevTheme,
            images: prevTheme.images.filter((image) => image.id !== id),
          }));

          Swal.fire({
            icon: "success",
            title: "Eliminada",
            text: "La imagen ha sido eliminada.",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (error) {
          console.error("Error al eliminar la imagen:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo eliminar la imagen. Intenta nuevamente.",
          });
        }
      }
    });
  };
  const updateLogo = (url, name) => {
    setTheme((prevTheme) => ({
      ...prevTheme,
      images: prevTheme.images.map((image) =>
        image.tipo === "Logo" ? { ...image, enlace: url, nombre: name } : image
      ),
    }));
  };

  const saveLogo = async () => {
    try {
      const logo = theme.images.find((image) => image.tipo === "Logo");
      if (!logo) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se encontró el logo para actualizar.",
        });
        return;
      }

      console.log("Datos enviados a updateImageRequest:", {
        id: logo.id,
        image: {
          tipo: "Logo",
          enlace: logo.enlace,
          nombre: logo.nombre,
        },
      });

      const [error] = await updateImageRequest({
        id: logo.id,
        image: {
          tipo: "Logo",
          enlace: logo.enlace,
          nombre: logo.nombre,
        },
      });

      if (error) {
        console.error("Error en la solicitud:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo actualizar el logo.",
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Logo actualizado correctamente.",
      });
    } catch (err) {
      console.error("Error al guardar el logo:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error inesperado al guardar el logo.",
      });
    }
  };
  const updateLoginBanner = (url, name) => {
    setTheme((prevTheme) => ({
      ...prevTheme,
      images: prevTheme.images.map((image) =>
        image.tipo === "LoginBanner" ? { ...image, enlace: url, nombre: name } : image
      ),
    }));
  };

  const saveLoginBanner = async () => {
    try {
      const banner = theme.images.find((image) => image.tipo === "LoginBanner");
      if (!banner) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se encontró el banner para actualizar.",
        });
        return;
      }

      console.log("Datos enviados a updateImageRequest:", {
        id: banner.id,
        image: {
          tipo: "LoginBanner",
          enlace: banner.enlace,
          nombre: banner.nombre,
        },
      });

      const [error] = await updateImageRequest({
        id: banner.id,
        image: {
          tipo: "LoginBanner",
          enlace: banner.enlace,
          nombre: banner.nombre,
        },
      });

      if (error) {
        console.error("Error en la solicitud:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo actualizar el banner.",
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Banner actualizado correctamente.",
      });
    } catch (err) {
      console.error("Error al guardar el banner:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error inesperado al guardar el banner.",
      });
    }
  };
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Personalización del Portal</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        {/* Control Panel */}
        <div className="md:col-span-1 border rounded-lg shadow-sm">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="colors">
                <Palette className="w-4 h-4 mr-2" />
                Colores
              </TabsTrigger>
              <TabsTrigger value="images">
                <ImageIcon className="w-4 h-4 mr-2" />
                Imágenes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="colors" className="p-4">
              <h3 className="text-lg font-medium mb-4">Colores del Portal</h3>
              {loading ? (
                <p>Cargando colores...</p>
              ) : (
                <div className="space-y-2">
                  {colorOrder
                    .filter((key) => theme.colors[key]) // Asegúrate de que el color exista en el estado
                    .map((key) => (
                      <div key={key} className="border rounded-md">
                        <Popover open={activeColor === key} onOpenChange={(isOpen) => !isOpen && setActiveColor(null)}>
                          <PopoverTrigger asChild>
                            <button
                              className={`w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-md ${activeColor === key ? "bg-gray-50" : ""
                                }`}
                              onClick={() => setActiveColor(key)}
                            >
                              <div
                                className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                                style={{ backgroundColor: theme.colors[key] }}
                              />
                              <span className="capitalize">{key}</span>
                              <div className="ml-auto text-xs text-gray-500">{theme.colors[key]}</div>
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 z-50 bg-white shadow-md rounded-md relative" align="start">
                            {/* Botón de cierre */}
                            <button
                              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                              onClick={() => setActiveColor(null)} // Cierra el popover
                            >
                              ✕
                            </button>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <h4 className="font-medium">Color {key}</h4>
                                <div
                                  className="w-full h-24 rounded-md border"
                                  style={{ backgroundColor: theme.colors[key] }}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor={`color-${key}`}>Seleccionar color</Label>
                                <div className="flex gap-2">
                                  <Input
                                    id={`color-${key}`}
                                    value={theme.colors[key]}
                                    onChange={(e) => updateColor(key, e.target.value)}
                                  />
                                  <input
                                    type="color"
                                    value={theme.colors[key]}
                                    onChange={(e) => updateColor(key, e.target.value)}
                                    className="w-10 h-10 p-1 rounded-md cursor-pointer"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-5 gap-2">
                                {["#0070f3", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"].map((color) => (
                                  <button
                                    key={color}
                                    className="w-full aspect-square rounded-md border p-1 relative"
                                    style={{ backgroundColor: color }}
                                    onClick={() => updateColor(key, color)}
                                  >
                                    {theme.colors[key] === color && (
                                      <Check className="absolute inset-0 m-auto text-white w-4 h-4" />
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    ))}
                </div>
              )}
            </TabsContent>

            {/* Images Tab */}
            <TabsContent value="images" className="p-4">
              {/* Existing image management code */}
              <h3 className="text-lg font-medium mb-4">Imágenes del Portal</h3>
              <Accordion type="single" collapsible className="w-full">

                <AccordionItem value="Carrousel">
                  <AccordionTrigger className="py-2 px-2 hover:bg-gray-50 rounded-md">
                    <div>
                      <h3 className="text-sm font-medium mb-2">
                        Carrusel de imágenes ({carrouselImages.length})
                      </h3>
                      <div className="border rounded-md p-2">
                        <div className="grid grid-cols-2 gap-2">
                          {carrouselImages.map((img) => (
                            <div
                              key={img.id}
                              className="relative group border rounded-md overflow-hidden cursor-pointer"
                              onClick={() => handleImageClick(img.id)} // Pasa el ID en lugar del índice
                            >
                              <img
                                src={img.enlace || "/placeholder.svg"}
                                alt={img.nombre || "Imagen del carrusel"}
                                className="w-full h-auto object-cover aspect-video"
                              />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white text-sm font-medium">Eliminar</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        {carrouselImages.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            No hay imágenes en el carrusel
                          </div>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-2">
                    <div className="space-y-4 py-2">
                      {/* Selector para URL o Subida */}
                      <div className="space-y-2">
                        <Label>Método de agregación</Label>
                        <div className="flex gap-4">
                          <Button
                            variant={activeImage === "url" ? "default" : "outline"}
                            onClick={() => setActiveImage("url")}
                          >
                            Usar URL
                          </Button>
                          <Button
                            variant={activeImage === "upload" ? "default" : "outline"}
                            onClick={() => setActiveImage("upload")}
                          >
                            Subir Imagen
                          </Button>
                        </div>
                      </div>

                      {/* Agregar imagen por URL */}
                      {activeImage === "url" && (
                        <div className="space-y-2">
                          <Label htmlFor="carousel-name">Nombre de la imagen</Label>
                          <Input
                            id="carousel-name"
                            placeholder="Nombre de la imagen"
                            value={imageName}
                            onChange={(e) => setImageName(e.target.value)}
                          />
                          <Label htmlFor="carousel-url">Agregar imagen por URL</Label>
                          <div className="flex gap-2">
                            <Input
                              id="carousel-url"
                              placeholder="https://ejemplo.com/imagen.jpg"
                              value={imageUrl}
                              onChange={(e) => setImageUrl(e.target.value)}
                            />
                            <Button
                              size="sm"
                              onClick={async () => {
                                if (imageUrl && imageName) {
                                  // Agregar imagen al estado local
                                  addCarouselImage(imageUrl, imageName);

                                  // Guardar imagen en la base de datos
                                  const [error] = await createImageRequest({
                                    tipo: "Carrousel",
                                    enlace: imageUrl,
                                    nombre: imageName,
                                  });

                                  if (error) {
                                    Swal.fire({
                                      icon: "error",
                                      title: "Error",
                                      text: "No se pudo guardar la imagen. Intenta nuevamente.",
                                    });
                                    return;
                                  }

                                  // Mostrar alerta de éxito
                                  Swal.fire({
                                    icon: "success",
                                    title: "Éxito",
                                    text: "Imagen agregada correctamente.",
                                  });

                                  // Limpiar campos
                                  setImageUrl("");
                                  setImageName("");
                                } else {
                                  Swal.fire({
                                    icon: "warning",
                                    title: "Campos incompletos",
                                    text: "Por favor, proporciona un nombre y una URL para la imagen.",
                                  });
                                }
                              }}
                            >
                              Agregar
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Subir nueva imagen */}
                      {activeImage === "upload" && (
                        <div className="space-y-2">
                          <Label htmlFor="carousel-upload">Subir nueva imagen</Label>
                          <div className="border border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 relative">
                            <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-gray-500">
                              Arrastra una imagen o haz clic para seleccionar
                            </p>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const fakeUrl = URL.createObjectURL(file); // Simula la URL de la imagen
                                  setImageUrl(fakeUrl);
                                }
                              }}
                              id="carousel-upload"
                            />
                            <label
                              htmlFor="carousel-upload"
                              className="block w-full h-full absolute inset-0 cursor-pointer"
                            >
                              <span className="sr-only">Subir imagen</span>
                            </label>
                          </div>
                          <div className="flex gap-2">
                            <Input
                              id="carousel-name-upload"
                              placeholder="Nombre de la imagen"
                              value={imageName}
                              onChange={(e) => setImageName(e.target.value)}
                            />
                            <Button
                              size="sm"
                              onClick={async () => {
                                if (imageUrl && imageName) {
                                  // Agregar imagen al estado local
                                  addCarouselImage(imageUrl, imageName);

                                  // Guardar imagen en la base de datos
                                  const [error] = await createImageRequest({
                                    tipo: "Carrousel",
                                    enlace: imageUrl,
                                    nombre: imageName,
                                  });

                                  if (error) {
                                    Swal.fire({
                                      icon: "error",
                                      title: "Error",
                                      text: "No se pudo guardar la imagen. Intenta nuevamente.",
                                    });
                                    return;
                                  }

                                  // Mostrar alerta de éxito
                                  Swal.fire({
                                    icon: "success",
                                    title: "Éxito",
                                    text: "Imagen agregada correctamente.",
                                  });

                                  // Limpiar campos
                                  setImageUrl("");
                                  setImageName("");
                                } else {
                                  Swal.fire({
                                    icon: "warning",
                                    title: "Campos incompletos",
                                    text: "Por favor, proporciona un nombre para la imagen antes de subirla.",
                                  });
                                }
                              }}
                            >
                              Agregar
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="Logo">
                  <AccordionTrigger className="py-2 px-2 hover:bg-gray-50 rounded-md">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Logo del Portal</h3>
                      <div className="border rounded-md p-2">
                        <div className="flex justify-center">
                          <img
                            src={logoImage?.enlace || "/placeholder.svg"}
                            alt="Logo"
                            className="h-24 w-auto object-contain rounded"
                          />
                        </div>
                        {!logoImage && (
                          <div className="text-center py-8 text-gray-500">
                            No hay logo configurado
                          </div>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-2">
                    <div className="space-y-4 py-2">
                      {/* Editar nombre del logo */}
                      <div className="space-y-2">
                        <Label htmlFor="logo-name">Nombre del logo</Label>
                        <Input
                          id="logo-name"
                          placeholder="Nombre del logo"
                          value={logoImage?.nombre || ""}
                          onChange={(e) => updateLogo(logoImage?.enlace, e.target.value)}
                        />
                      </div>

                      {/* Selector para URL o Subida */}
                      <div className="space-y-2">
                        <Label>Método de actualización</Label>
                        <div className="flex gap-4">
                          <Button
                            variant={activeImage === "url" ? "default" : "outline"}
                            onClick={() => setActiveImage("url")}
                          >
                            Usar URL
                          </Button>
                          <Button
                            variant={activeImage === "upload" ? "default" : "outline"}
                            onClick={() => setActiveImage("upload")}
                          >
                            Subir Imagen
                          </Button>
                        </div>
                      </div>

                      {/* Actualizar logo por URL */}
                      {activeImage === "url" && (
                        <div className="space-y-2">
                          <Label htmlFor="logo-url">Actualizar logo por URL</Label>
                          <div className="flex gap-2">
                            <Input
                              id="logo-url"
                              placeholder="https://ejemplo.com/logo.jpg"
                              value={logoImage?.enlace || ""}
                              onChange={(e) => updateLogo(e.target.value, logoImage?.nombre)}
                            />
                            <Button size="sm" onClick={saveLogo}>
                              Guardar
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Subir nuevo logo */}
                      {activeImage === "upload" && (
                        <div className="space-y-2">
                          <Label>Subir nuevo logo</Label>
                          <div className="border border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 relative">
                            <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-gray-500">
                              Arrastra una imagen o haz clic para seleccionar
                            </p>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const fakeUrl = URL.createObjectURL(file); // Simula la URL de la imagen
                                  updateLogo(fakeUrl, logoImage?.nombre);
                                }
                              }}
                              id="logo-upload"
                            />
                            <label
                              htmlFor="logo-upload"
                              className="block w-full h-full absolute inset-0 cursor-pointer"
                            >
                              <span className="sr-only">Subir logo</span>
                            </label>
                          </div><Button size="sm" onClick={saveLogo}>
                            Guardar
                          </Button>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="LoginBanner">
                  <AccordionTrigger className="py-2 px-2 hover:bg-gray-50 rounded-md">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Banner de Inicio de Sesión</h3>
                      <div className="border rounded-md p-2">
                        <div className="flex justify-center">
                          <img
                            src={LoginBanner?.enlace || "/placeholder.svg"}
                            alt="Login Banner"
                            className="h-32 w-auto object-contain rounded"
                          />
                        </div>
                        {!LoginBanner && (
                          <div className="text-center py-8 text-gray-500">
                            No hay banner configurado
                          </div>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-2">
                    <div className="space-y-4 py-2">
                      {/* Editar nombre del banner */}
                      <div className="space-y-2">
                        <Label htmlFor="banner-name">Nombre del banner</Label>
                        <Input
                          id="banner-name"
                          placeholder="Nombre del banner"
                          value={LoginBanner?.nombre || ""}
                          onChange={(e) => updateLoginBanner(LoginBanner?.enlace, e.target.value)}
                        />
                      </div>

                      {/* Selector para URL o Subida */}
                      <div className="space-y-2">
                        <Label>Método de actualización</Label>
                        <div className="flex gap-4">
                          <Button
                            variant={activeImage === "url" ? "default" : "outline"}
                            onClick={() => setActiveImage("url")}
                          >
                            Usar URL
                          </Button>
                          <Button
                            variant={activeImage === "upload" ? "default" : "outline"}
                            onClick={() => setActiveImage("upload")}
                          >
                            Subir Imagen
                          </Button>
                        </div>
                      </div>

                      {/* Actualizar banner por URL */}
                      {activeImage === "url" && (
                        <div className="space-y-2">
                          <Label htmlFor="banner-url">Actualizar banner por URL</Label>
                          <div className="flex gap-2">
                            <Input
                              id="banner-url"
                              placeholder="https://ejemplo.com/banner.jpg"
                              value={LoginBanner?.enlace || ""}
                              onChange={(e) => updateLoginBanner(e.target.value, LoginBanner?.nombre)}
                            />
                            <Button size="sm" onClick={saveLoginBanner}>
                              Guardar
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Subir nuevo banner */}
                      {activeImage === "upload" && (
                        <div className="space-y-2">
                          <Label>Subir nuevo banner</Label>
                          <div className="border border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 relative">
                            <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-gray-500">
                              Arrastra una imagen o haz clic para seleccionar
                            </p>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const fakeUrl = URL.createObjectURL(file); // Simula la URL de la imagen
                                  updateLoginBanner(fakeUrl, LoginBanner?.nombre);
                                }
                              }}
                              id="banner-upload"
                            />
                            <label
                              htmlFor="banner-upload"
                              className="block w-full h-full absolute inset-0 cursor-pointer"
                            >
                              <span className="sr-only">Subir banner</span>
                            </label>
                          </div>
                          <Button size="sm" onClick={saveLoginBanner}>
                            Guardar
                          </Button>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

            </TabsContent>
          </Tabs>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              {/* Mostrar el botón de guardar colores solo si la pestaña activa es "colors" */}
              {activeTab === "colors" && (
                <Button className="w-full" onClick={saveColors}>
                  Guardar colores
                </Button>
              )}

              {/* Botón para cancelar cambios (siempre visible) */}
              <Button variant="outline" className="w-full" onClick={cancelChanges}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="md:col-span-2 border rounded-lg shadow-sm p-6 overflow-auto">
          <h2 className="text-xl font-semibold mb-4">Vista previa</h2>
          <Separator className="mb-6" />

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Logo</h3>
              <img src={logoImage?.enlace || "/placeholder.svg"} alt="Logo" width={"100px"} height={"100px"} className="border rounded p-2" />
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Colores del tema</h3>
              <div className="grid grid-cols-5 gap-2">
                {colorOrder
                  .filter((key) => theme.colors[key]) // Asegúrate de que el color exista en el estado
                  .map((key) => (
                    <div key={key} className="text-center">
                      <div
                        className="w-full aspect-square rounded-md mb-1"
                        style={{ backgroundColor: theme.colors[key] }}
                      />
                      <span className="text-xs capitalize">{key}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Banner</h3>
              <img
                src={LoginBanner?.enlace || "/placeholder.svg"}
                alt="Banner"
                className="w-full h-auto rounded-md border"
              />
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Carrusel de imágenes ({carrouselImages.length})</h3>
              <div className="border rounded-md p-2">
                <div className="grid grid-cols-3 gap-2">
                  {carrouselImages.map((img, index) => (
                    <img
                      src={img.enlace || "/placeholder.svg"} // Usa el operador opcional `?.`
                      alt="Banner"
                      className="w-full h-auto rounded-md border"
                    />
                  ))}
                </div>
                {carrouselImages.length === 0 && (
                  <div className="text-center py-8 text-gray-500">No hay imágenes en el carrusel</div>
                )}
              </div>
            </div>

            <div className="p-4 rounded-lg" style={{ backgroundColor: theme.colors.background }}>
              <h3 className="text-lg font-medium mb-2" style={{ color: theme.colors.text }}>
                Ejemplo de contenido
              </h3>
              <p style={{ color: theme.colors.text }}>
                Este es un ejemplo de cómo se verían los colores en el contenido.
              </p>
              <div className="flex gap-2 mt-4">
                <Button
                  style={{
                    backgroundColor: theme.colors.Primary,
                    color: theme.colors.text || "#fff",
                  }}
                >
                  Botón primario
                </Button>
                <Button
                  style={{
                    backgroundColor: theme.colors.Secondary,
                    color: theme.colors.text || "#fff",
                  }}
                >
                  Botón secundario
                </Button>
                <Button
                  style={{
                    backgroundColor: theme.colors.Accent,
                    color: theme.colors.text || "#fff",
                  }}
                >
                  Botón acento
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}