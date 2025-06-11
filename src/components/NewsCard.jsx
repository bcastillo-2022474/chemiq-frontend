"use client"

import { formatDate } from "@/lib/utils"
import { Calendar, Clock } from 'lucide-react'

const NewsCard = ({  title, description, date, imageUrl, createdAt }) => {
  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col md:flex-row h-auto md:h-64 border border-gray-100 hover:border-[#28BC98]/20">
      {/* Image Section */}
      <div className="md:w-2/5 lg:w-1/3 relative overflow-hidden">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = "/placeholder.svg"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-60 md:opacity-0 md:group-hover:opacity-60 transition-opacity" />
      </div>

      {/* Content Section */}
      <div className="md:w-3/5 lg:w-2/3 p-5 md:p-6 flex flex-col justify-between relative">
        {/* Badge */}
        <div className="absolute top-5 right-5">
          <span className="bg-[#28BC98]/10 text-[#28BC98] text-xs font-medium px-2.5 py-1 rounded-full">
            Noticia
          </span>
        </div>

        {/* Title and Description */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#28BC98] transition-colors line-clamp-2">
            {title}
          </h2>
          <p className="text-gray-600 line-clamp-3 text-sm">{description}</p>
        </div>

        {/* Footer with Date and Read More */}
        <div className="flex flex-wrap justify-between items-center mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-col gap-1">
            {date && (
              <span className="text-gray-500 text-xs flex items-center">
                <Calendar className="w-3 h-3 mr-1.5 text-[#28BC98]" />
                {formatDate(date)}
              </span>
            )}
            {createdAt && (
              <span className="text-gray-400 text-xs flex items-center">
                <Clock className="w-3 h-3 mr-1.5 text-gray-400" />
                {formatDate(createdAt)}
              </span>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default NewsCard
