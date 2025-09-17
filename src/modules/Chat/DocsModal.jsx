import PropTypes from "prop-types";
import { FaTimes } from "react-icons/fa";

export default function DocsModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-3/4 max-w-2xl p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-red-600">
          <FaTimes size={18} />
        </button>
        <h2 className="text-lg font-bold mb-4">Documents & Images</h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="h-24 bg-gray-200 rounded-lg flex items-center justify-center">📄 File</div>
          <div className="h-24 bg-gray-200 rounded-lg flex items-center justify-center">🖼️ Image</div>
          <div className="h-24 bg-gray-200 rounded-lg flex items-center justify-center">📄 File</div>
        </div>
      </div>
    </div>
  );
}

DocsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};
