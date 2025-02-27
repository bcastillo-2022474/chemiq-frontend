import PropTypes from "prop-types"

const NewsCard = ({ title, description, date, imageUrl, onClick }) => {
  return (
    <div className="flex flex-col md:flex-row gap-6 mb-8 bg-white rounded-lg overflow-hidden">
      <div className="md:w-1/3">
        <img src={imageUrl || "/placeholder.svg"} alt={title} className="w-full h-64 md:h-full object-cover" />
      </div>
      <div className="md:w-2/3 p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600 mb-4">{description}</p>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm">{date}</span>
          <button
            onClick={onClick}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            Read ...
          </button>
        </div>
      </div>
    </div>
  )
}

NewsCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  onClick: PropTypes.func,
}

NewsCard.defaultProps = {
  imageUrl: "/placeholder.svg",
  onClick: () => {},
}

export default NewsCard

