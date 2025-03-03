"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Newspaper, Calendar, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import axios from "axios"

export function FeaturedNews() {
  const [news, setNews] = useState(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("https://backend-postgresql.vercel.app/api/news")
        const newsItems = response.data
        const mostRecentNews = newsItems[newsItems.length - 1]
        setNews(mostRecentNews)
      } catch (error) {
        console.error("Error fetching news:", error)
      }
    }

    fetchNews()
  }, [])

  if (!news) {
    return <Card className="h-64 animate-pulse bg-[#7DE2A6]/10" />
  }

  return (
    <Link to={`/noticias/${news.id}`}>
      <Card className="h-64 overflow-hidden bg-white hover:shadow-md transition-all duration-300">
        <div className="flex h-full">
          <div className="w-1/3 relative">
            <img src={news.imagen || "/placeholder.svg"} alt={news.titulo} className="object-cover w-full h-full" />
            <div className="absolute inset-0" />
          </div>
          <CardContent className="w-2/3 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center mb-2">
                <Newspaper className="h-5 w-5 mr-2 text-[#28BC98]" />
                <h3 className="text-xl font-semibold text-[#0B2F33] truncate">{news.titulo}</h3>
              </div>
              <p className="text-sm text-[#0B2F33]/70 line-clamp-2">{news.contenido}</p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-[#28BC98] mr-1" />
                <span className="text-xs text-[#0B2F33]/70">{new Date(news.fecha).toLocaleDateString()}</span>
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

