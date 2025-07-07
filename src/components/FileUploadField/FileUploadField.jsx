import { ErrorMessage } from "formik";
import { PropTypes } from "prop-types";
import { useRef } from "react";
import { TiDeleteOutline } from "react-icons/ti";
import { FiUpload } from "react-icons/fi";
import { IoMdDocument } from "react-icons/io";
import { useTranslation } from "react-i18next";

export const FileUploadField = ({
  selectedFiles,
  setSelectedFiles,
  setFieldValue,
  name,
  label,
  accept,
  multiple = true,
}) => {
  const fileInputRef = useRef(null);
  const { t } = useTranslation("layout");

  const handleFileChange = (event) => {
    const files = Array.from(event?.target?.files || []);
    if (files.length > 0) {
      const updatedFiles = multiple
        ? [...(selectedFiles || []), ...files]
        : [files[0]];

      setSelectedFiles(updatedFiles);
      setFieldValue(name, updatedFiles); // Always array
      fileInputRef.current.value = "";
    }
  };
  const handleRemoveFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setFieldValue(name, newFiles); // Always array
  };

  return (
    <>
      <label className="block text-lg font-medium mb-1">{label}</label>
      <div className="space-y-4">
        <div className="relative w-full min-h-[100px] bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md flex items-center justify-center cursor-pointer overflow-hidden">
          <div
            className="flex flex-col justify-center items-center w-full h-full p-6"
            onClick={() => fileInputRef.current.click()}
          >
            <FiUpload className="text-4xl mb-2 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {t("click_to_upload")} {label.toLowerCase()}
            </p>
            {multiple && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {t("multiple_files_allowed")}
              </p>
            )}
          </div>

          <input
            ref={fileInputRef}
            name={name}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            multiple={multiple}
            className="hidden"
          />
        </div>

        {selectedFiles?.length > 0 && (
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="relative w-full p-3 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <IoMdDocument className="text-2xl text-gray-600 dark:text-gray-300" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {file.type.startsWith("image/")
                        ? `image_names[${index}]`
                        : file.type === "application/pdf"
                        ? `pdf_names[${index}]`
                        : file.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {file.name} - {(file.size / 1024).toFixed(2)} KB
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="btn btn-circle btn-sm btn-ghost text-2xl hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900"
                >
                  <TiDeleteOutline />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm mt-1"
      />
    </>
  );
};

FileUploadField.propTypes = {
  selectedFiles: PropTypes.arrayOf(PropTypes.object),
  setSelectedFiles: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  accept: PropTypes.string,
  multiple: PropTypes.bool,
};
