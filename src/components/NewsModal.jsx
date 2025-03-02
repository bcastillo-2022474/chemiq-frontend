import PropTypes from "prop-types";

const NewsModal = ({ isOpen, onClose, title, content, imageUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
      <div className="bg-white rounded-2xl overflow-hidden max-w-5xl w-full m-4">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-gray-500 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-600 transition-colors text-2xl"
          >
            &times;
          </button>
        </div>
        <div className="p-11 overflow-auto max-h-[calc(120vh-10rem)]">
         <img src={imageUrl || "/placeholder.svg"} alt={title} className="w-full h-64 object-cover rounded-t-2xl" />
          <h2 className="text-4xl font-bold text-accent mb-9 mt-14 text-center">{title}</h2>
          <p className=" text-gray-700 text-lg leading-relaxed text-justify">{content}</p>
        </div>
      </div>
    </div>
  );
};

NewsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
};

NewsModal.defaultProps = {
  imageUrl: "/placeholder.svg",
};

export default NewsModal;