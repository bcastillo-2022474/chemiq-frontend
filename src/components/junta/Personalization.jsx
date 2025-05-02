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
import { getImages, getImageByTypeRequest } from "../../actions/image"
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
  const [loading, setLoading] = useState(true)
  const colorOrder = ["Primary", "Secondary", "Tertiary", "Accent", "Background"];
  // Fetch colors from the database
  const fetchImages = async () => {
    setLoading(true);
    try {
      const [error, images] = await getImages();
      console.log("Response from getImages:", images); // Verifica la estructura de los datos aquí
      if (error) {
        console.error("Error fetching images:", error);
        setLoading(false);
        return;
      }

      setTheme((prevTheme) => ({
        ...prevTheme,
        images: Array.isArray(images) ? images : [], // Asegúrate de que sea un array
      }));
    } catch (err) {
      console.error("Unexpected error fetching images:", err);
    } finally {
      setLoading(false);
    }
  };
  const carrouselImages = theme.images.filter((image) => image.tipo === "Carrousel");
  const logoImage = theme.images.find((image) => image.tipo === "logo");
  const heroImage = theme.images.find((image) => image.tipo === "hero");
  console.log("Carrousel images:", carrouselImages);
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
    fetchColors()
    fetchImages()
  }, [])

  // Update a specific color
  const updateColor = (nombre, hex) => {
    // Actualiza el estado local
    setTheme((prevTheme) => ({
      ...prevTheme,
      colors: {
        ...prevTheme.colors,
        [nombre]: hex,
      },
    }));
  };

  const saveColors = async () => {
    try {
      const colors = theme.colors; // Obtén los colores del estado local
      const promises = Object.entries(colors).map(([nombre, hex]) =>
        updateColorRequest({ nombre, color: { hex } })
      );

      const results = await Promise.all(promises);

      // Manejo de errores en las solicitudes
      const errors = results.filter(([error]) => error);
      if (errors.length > 0) {
        void Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron guardar algunos colores.",
        });
        return;
      }

      // Si todo se guarda correctamente
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
    fetchColors(); // Vuelve a cargar los colores desde la base de datos
    setTheme(initialTheme); // Restablece el estado del tema al inicial
    setActiveColor(null); // Cierra cualquier popover abierto
    setImageUrl(""); // Limpia el campo de URL de imágenes
  };
  // Update an image
  const updateImage = (key, value) => {
    setTheme({
      ...theme,
      images: {
        ...theme.images,
        [key]: value,
      },
    })
  }


  // Save changes
  const saveChanges = () => {
    console.log("Saving theme:", theme)
    // Add logic to save the theme to the database
  }

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
                        <div className="grid grid-cols-3 gap-2">
                          {carrouselImages.map((img, index) => (
                            <img
                              key={index}
                              src={img.enlace || "/placeholder.svg"}
                              alt={`Slide ${index + 1}`}
                              className="w-full h-auto aspect-video object-cover rounded"
                            />
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
                      {/* Vista previa de las imágenes del carrusel */}
                      <div className="space-y-2">
                        <Label>Imágenes actuales</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {carrouselImages.map((img, index) => (
                            <div
                              key={index}
                              className="relative group border rounded-md overflow-hidden"
                            >
                              <img
                                src={img.enlace || "/placeholder.svg"}
                                alt={`Slide ${index + 1}`}
                                className="w-full h-auto object-cover aspect-video"
                              />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeCarouselImage(index)}
                                  className="h-8"
                                >
                                  Eliminar
                                </Button>
                              </div>
                              <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                                {index + 1}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Agregar nueva imagen al carrusel */}
                      <div className="space-y-2">
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
                            onClick={() => {
                              if (imageUrl) {
                                addCarouselImage(imageUrl);
                                setImageUrl("");
                              }
                            }}
                          >
                            Agregar
                          </Button>
                        </div>
                      </div>

                      {/* Subir nueva imagen al carrusel */}
                      <div className="space-y-2">
                        <Label>Subir nueva imagen</Label>
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
                                addCarouselImage(fakeUrl);
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
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

            </TabsContent>
          </Tabs>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Button className="w-full" onClick={saveColors}>
                Guardar cambios
              </Button>
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
              <img src={theme.images.logo || "/placeholder.svg"} alt="Logo" className="h-12 border rounded p-2" />
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
              <h3 className="text-sm font-medium mb-2">Imagen de héroe</h3>
              <img
                src={theme.images.hero || "/placeholder.svg"}
                alt="Hero"
                className="w-full h-auto rounded-md border"
              />
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Banner</h3>
              <img
                src={theme.images.banner || "/placeholder.svg"}
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
                      key={index}
                      src={img.enlace || "/placeholder.svg"} // Asegúrate de usar `img.url` si existe
                      alt={`Slide ${index + 1}`}
                      className="w-full h-auto aspect-video object-cover rounded"
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