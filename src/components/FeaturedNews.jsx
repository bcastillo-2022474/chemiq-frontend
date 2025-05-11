import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Newspaper, Calendar, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { getNewsRequest } from "@/actions/news"
import { formatDate } from "@/lib/utils"
import { getColors } from "@/actions/personalization"

export function FeaturedNews() {
  const [article, setArticle] = useState(null)
  const [theme, setTheme] = useState({
    colors: {}, // Inicialmente vacío
  })

  const fetchColors = async () => {
    const [error, colors] = await getColors()
    if (error) {
      console.error("Error fetching colors:", error)
      return
    }
    const formattedColors = Object.fromEntries(
      colors.map((color) => [color.nombre, color.hex])
    )
    setTheme((prevTheme) => ({
      ...prevTheme,
      colors: formattedColors,
    }))
    console.log("Fetched colors:", formattedColors)
  }

  useEffect(() => {
    fetchColors()
    async function fetchNews() {
      const [error, news] = await getNewsRequest()
      if (error) {
        console.error("Error fetching news:", error)
        return
      }
      const lastArticle = news[news.length - 1]
      setArticle(lastArticle)
    }

    void fetchNews()
  }, [])

  if (!article) {
    return (
      <Card
        className="h-64 animate-pulse"
        style={{ backgroundColor: `${theme.colors.Secondary || '#e4e4e4'}1a` }}
      />
    )
  }

  return (
    <Link to={`./noticias/${article.id}`}>
      <Card
        className="h-64 overflow-hidden hover:shadow-[0_4px_12px_rgba(95,95,95,0.2)] transition-all duration-300"
        style={{ backgroundColor: theme.colors.Background || '#fff8f0' }}
      >
        <div className="flex h-full">
          <div className="w-1/3 relative">
            <img
              src={article.img || "/placeholder.svg"}
              alt={article.titulo}
              className="object-cover w-full h-full"
            />
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(to top, ${theme.colors.Tertiary || '#5f5f5f'}99, transparent)` }}
            />
          </div>
          <CardContent className="w-2/3 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center mt-10 mb-2">
                <Newspaper
                  className="h-5 w-5 mr-2"
                  style={{ color: theme.colors.Primary || '#fc5000' }}
                />
                <h3
                  className="text-xl font-semibold truncate"
                  style={{ color: theme.colors.Accent || '#505050' }}
                >
                  {article.titulo}
                </h3>
              </div>
              <p
                className="text-sm mt-5 line-clamp-2"
                style={{ color: `${theme.colors.Tertiary || '#5f5f5f'}b3`, width: "80ch" }}
              >
                {article.contenido}
              </p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center">
                <Calendar
                  className="h-4 w-4 mr-1"
                  style={{ color: theme.colors.Primary || '#fc5000' }}
                />
                <span
                  className="text-xs"
                  style={{ color: `${theme.colors.Tertiary || '#5f5f5f'}b3` }}
                >
                  {formatDate(article.created_at)}
                </span>
              </div>
              <div
                className="px-3 py-1 rounded-full text-xs font-medium transition-colors duration-300 flex items-center"
                style={{
                  backgroundColor: theme.colors.Primary || '#fc5000',
                  color: theme.colors.Secondary || '#e4e4e4'
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = theme.colors.Accent || '#505050')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = theme.colors.Primary || '#fc5000')
                }
              >
                Leer más
                <ArrowRight className="h-3 w-3 ml-1" />
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  )
}