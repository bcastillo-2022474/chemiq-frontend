import PropTypes from "prop-types";

const NewsCard = ({ title, description, date, imageUrl, onReadMore, showReadMore, createdAt }) => {
  return (
    <div className="flex flex-col md:flex-row gap-6 mb-8 bg-white rounded-lg overflow-hidden h-64">
      <div className="md:w-1/3">
        <img src={imageUrl || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="md:w-2/3 p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600 mb-4">{description}</p>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-gray-500 text-sm">{date}</span>
            <span className="text-gray-400 text-xs block">{createdAt}</span>
          </div>
          {showReadMore && (
            <button
              onClick={onReadMore}
              className="px-4 py-2 bg-[#29bc97] text-white rounded-md hover:bg-[#1d896e] transition-colors"
            >
              Leer más
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

NewsCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  onReadMore: PropTypes.func,
  showReadMore: PropTypes.bool,
  createdAt: PropTypes.string.isRequired,
};

NewsCard.defaultProps = {
  imageUrl: "/placeholder.svg",
  onReadMore: () => {},
  showReadMore: false,
};

export default NewsCard;

