import NewsCard from "./NewsCard"

const NewsSection = () => {
  // Datos de ejemplo para las noticias
  const newsItems = [
    {
      id: 1,
      title: "New guidelines for chemical safety",
      description:
        "The Chemical Safety Board has released new guidelines for chemical safety in the workplace. The guidelines are designed to help employers and workers identify and manage chemical hazards, reduce the risk of accidents and injuries, and promote a safe and healthy work environment.",
      date: "June 22, 2022",
      imageUrl: "/placeholder.svg?height=300&width=500",
      onClick: () => console.log("Read more about chemical safety"),
    },
    {
      id: 2,
      title: "Advances in green chemistry",
      description:
        "Researchers at the University of California, Berkeley have made a major breakthrough in the field of green chemistry. The team has developed a new method for producing bio-based polymers that is more efficient, cost-effective, and environmentally friendly than current methods. The research has the potential to revolutionize the production of a wide range of products, from packaging materials to medical devices, and help reduce our reliance on fossil fuels and petrochemicals.",
      date: "June 15, 2022",
      imageUrl: "/placeholder.svg?height=300&width=500",
      onClick: () => console.log("Read more about green chemistry"),
    },
    {
      id: 3,
      title: "Chemical industry trends and outlook",
      description:
        "The global chemical industry is experiencing rapid growth and transformation, driven by technological innovation, changing consumer preferences, and evolving regulatory requirements. Key trends shaping the industry include the rise of sustainable and bio-based products, the increasing use of digital technologies and data analytics, and the growing demand for specialty chemicals and advanced materials.",
      date: "June 8, 2022",
      imageUrl: "/placeholder.svg?height=300&width=500",
      onClick: () => console.log("Read more about industry trends"),
    },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Noticias</h1>
      <p className="text-gray-600 mb-8">
        Mantente actualizado con noticias, anuncios y más de la Asociación de Química UVG
      </p>

      <div className="space-y-8">
        {newsItems.map((item) => (
          <NewsCard
            key={item.id}
            title={item.title}
            description={item.description}
            date={item.date}
            imageUrl={item.imageUrl}
            onClick={item.onClick}
          />
        ))}
      </div>
    </div>
  )
}

export default NewsSection

