import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card.jsx"
import { Newspaper, Calendar, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { getNewsRequest } from "@/actions/news"
import { formatDate } from "@/lib/utils"

export function FeaturedNews() {
  const [article, setArticle] = useState(null)

  useEffect(() => {
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
    return <Card className="h-64 animate-pulse bg-[#7DE2A6]/10" />
  }

  return (
    <Link to={`/noticias/${article.id}`}>
      <Card className="h-64 overflow-hidden bg-white hover:shadow-md transition-all duration-300">
        <div className="flex h-full">
          <div className="w-1/3 relative">
            <img
              src={article.img || "/placeholder.svg"}
              alt={article.titulo}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0" />
          </div>
          <CardContent className="w-2/3 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center mb-2">
                <Newspaper className="h-5 w-5 mr-2 text-[#28BC98]" />
                <h3 className="text-xl font-semibold text-[#0B2F33] truncate">
                  {article.titulo}
                </h3>
              </div>
              <p className="text-sm text-[#0B2F33]/70 line-clamp-2">
                {article.contenido}
              </p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-[#28BC98] mr-1" />
                <span className="text-xs text-[#0B2F33]/70">
                  {formatDate(article.created_at)}
                </span>
              </div>
              <div className="bg-[#28BC98] text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-[#7DE2A6] transition-colors duration-300 flex items-center">
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
