"use client"

import { useState } from "react"
import { Check, ImageIcon, Palette, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

// Datos de ejemplo para el tema
const initialTheme = {
  colors: {
    primary: "#0070f3",
    secondary: "#6c757d",
    accent: "#f59e0b",
    background: "#ffffff",
    text: "#333333",
  },
  images: {
    logo: "/placeholder.svg?height=80&width=200",
    hero: "/placeholder.svg?height=400&width=800",
    banner: "/placeholder.svg?height=200&width=1200",
    favicon: "/placeholder.svg?height=32&width=32",
    carousel: [
      "/placeholder.svg?height=300&width=600&text=Slide+1",
      "/placeholder.svg?height=300&width=600&text=Slide+2",
      "/placeholder.svg?height=300&width=600&text=Slide+3",
    ],
  },
}

export default function Personalization() {
  const [theme, setTheme] = useState(initialTheme)
  const [activeTab, setActiveTab] = useState("colors")
  const [activeColor, setActiveColor] = useState(null)
  const [activeImage, setActiveImage] = useState(null)
  const [imageUrl, setImageUrl] = useState("")

  // Función para actualizar un color
  const updateColor = (key, value) => {
    setTheme({
      ...theme,
      colors: {
        ...theme.colors,
        [key]: value,
      },
    })
  }

  // Función para actualizar una imagen
  const updateImage = (key, value) => {
    setTheme({
      ...theme,
      images: {
        ...theme.images,
        [key]: value,
      },
    })
  }

  // Función para agregar una imagen al carrusel
  const addCarouselImage = (url) => {
    setTheme({
      ...theme,
      images: {
        ...theme.images,
        carousel: [...theme.images.carousel, url],
      },
    })
  }

  // Función para eliminar una imagen del carrusel
  const removeCarouselImage = (index) => {
    const newCarousel = [...theme.images.carousel]
    newCarousel.splice(index, 1)
    setTheme({
      ...theme,
      images: {
        ...theme.images,
        carousel: newCarousel,
      },
    })
  }

  // Función para guardar los cambios
  const saveChanges = () => {
    console.log("Guardando tema:", theme)
    // Aquí iría la lógica para guardar en la base de datos
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Personalización del Portal</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        {/* Panel de control */}
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
              <div className="space-y-2">
                {Object.entries(theme.colors).map(([key, value]) => (
                  <div key={key} className="border rounded-md">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          className={`w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-md ${
                            activeColor === key ? "bg-gray-50" : ""
                          }`}
                          onClick={() => setActiveColor(key)}
                        >
                          <div
                            className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                            style={{ backgroundColor: value }}
                          />
                          <span className="capitalize">{key}</span>
                          <div className="ml-auto text-xs text-gray-500">{value}</div>
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80" align="start">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <h4 className="font-medium">Color {key}</h4>
                            <div className="w-full h-24 rounded-md border" style={{ backgroundColor: value }} />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor={`color-${key}`}>Seleccionar color</Label>
                            <div className="flex gap-2">
                              <Input
                                id={`color-${key}`}
                                value={value}
                                onChange={(e) => updateColor(key, e.target.value)}
                              />
                              <input
                                type="color"
                                value={value}
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
                                {value === color && <Check className="absolute inset-0 m-auto text-white w-4 h-4" />}
                              </button>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="images" className="p-4">
              <h3 className="text-lg font-medium mb-4">Imágenes del Portal</h3>
              <Accordion type="single" collapsible className="w-full">
                {Object.entries(theme.images).map(([key, value]) => {
                  if (key === "carousel") return null
                  return (
                    <AccordionItem key={key} value={key}>
                      <AccordionTrigger className="py-2 px-2 hover:bg-gray-50 rounded-md">
                        <div className="flex items-center">
                          <ImageIcon className="w-4 h-4 mr-2" />
                          <span className="capitalize">{key}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-2">
                        <div className="space-y-4 py-2">
                          <div className="border rounded-md overflow-hidden">
                            <img
                              src={value || "/placeholder.svg"}
                              alt={key}
                              className="w-full h-auto object-contain max-h-32"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`image-url-${key}`}>URL de imagen</Label>
                            <div className="flex gap-2">
                              <Input
                                id={`image-url-${key}`}
                                placeholder="https://ejemplo.com/imagen.jpg"
                                value={activeImage === key ? imageUrl : ""}
                                onChange={(e) => setImageUrl(e.target.value)}
                                onFocus={() => setActiveImage(key)}
                              />
                              <Button
                                size="sm"
                                onClick={() => {
                                  if (imageUrl && activeImage === key) {
                                    updateImage(key, imageUrl)
                                    setImageUrl("")
                                  }
                                }}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Subir imagen</Label>
                            <div className="border border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 relative">
                              <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                              <p className="text-sm text-gray-500">Arrastra una imagen o haz clic para seleccionar</p>
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) {
                                    // En un caso real, aquí subiríamos el archivo
                                    // y obtendríamos la URL
                                    const fakeUrl = URL.createObjectURL(file)
                                    updateImage(key, fakeUrl)
                                  }
                                }}
                                id={`file-upload-${key}`}
                              />
                              <label
                                htmlFor={`file-upload-${key}`}
                                className="block w-full h-full absolute inset-0 cursor-pointer"
                              >
                                <span className="sr-only">Subir imagen</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
                {/* Sección especial para el carrusel */}
                <AccordionItem value="carousel">
                  <AccordionTrigger className="py-2 px-2 hover:bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <ImageIcon className="w-4 h-4 mr-2" />
                      <span>Imágenes de Carrusel</span>
                      <div className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-gray-100">
                        {theme.images.carousel.length}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-2">
                    <div className="space-y-4 py-2">
                      {/* Vista previa de las imágenes actuales */}
                      <div className="space-y-2">
                        <Label>Imágenes actuales</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {theme.images.carousel.map((img, index) => (
                            <div key={index} className="relative group border rounded-md overflow-hidden">
                              <img
                                src={img || "/placeholder.svg"}
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

                      {/* Agregar nueva imagen por URL */}
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
                                addCarouselImage(imageUrl)
                                setImageUrl("")
                              }
                            }}
                          >
                            Agregar
                          </Button>
                        </div>
                      </div>

                      {/* Subir nueva imagen */}
                      <div className="space-y-2">
                        <Label>Subir nueva imagen</Label>
                        <div className="border border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 relative">
                          <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-500">Arrastra una imagen o haz clic para seleccionar</p>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                // En un caso real, aquí subiríamos el archivo
                                // y obtendríamos la URL
                                const fakeUrl = URL.createObjectURL(file)
                                addCarouselImage(fakeUrl)
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
              <Button className="w-full" onClick={saveChanges}>
                Guardar cambios
              </Button>
              <Button variant="outline" className="w-full">
                Cancelar
              </Button>
            </div>
          </div>
        </div>

        {/* Área de previsualización */}
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
                {Object.entries(theme.colors).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="w-full aspect-square rounded-md mb-1" style={{ backgroundColor: value }} />
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
              <h3 className="text-sm font-medium mb-2">Carrusel de imágenes ({theme.images.carousel.length})</h3>
              <div className="border rounded-md p-2">
                <div className="grid grid-cols-3 gap-2">
                  {theme.images.carousel.map((img, index) => (
                    <img
                      key={index}
                      src={img || "/placeholder.svg"}
                      alt={`Slide ${index + 1}`}
                      className="w-full h-auto aspect-video object-cover rounded"
                    />
                  ))}
                </div>
                {theme.images.carousel.length === 0 && (
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
                <Button style={{ backgroundColor: theme.colors.primary }}>Botón primario</Button>
                <Button style={{ backgroundColor: theme.colors.secondary }}>Botón secundario</Button>
                <Button style={{ backgroundColor: theme.colors.accent }}>Botón acento</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
