import { ErrorMessage } from "formik";
import { PropTypes } from "prop-types";
import { useRef } from "react";
import { TiDeleteOutline } from "react-icons/ti";
import { FcAddImage } from "react-icons/fc";
import { useTranslation } from "react-i18next";
import { LazyImage } from "../LazyImage/LazyImage";

export const FileInputField = ({
  imagePreview,
  setImagePreview,
  setFieldValue,
  name,
  label,
  object_fit,
}) => {
  const fileInputRef = useRef(null);
  const { t } = useTranslation("layout");

  const handleFileChange = (event) => {
    const file = event?.target?.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setFieldValue(name, file);
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFieldValue(name, null);
    fileInputRef.current.value = "";
  };

  return (
    <>
      <label className="block text-lg font-medium mb-1">{label}</label>
      <div className="relative w-full h-60 bg-gray-200 border-2 border-gray-300 rounded-md flex items-center justify-center cursor-pointer overflow-hidden">
        {imagePreview ? (
          <div className="relative w-full h-full">
            <LazyImage
              src={imagePreview}
              alt="Image Preview"
              className={`object-${object_fit || "cover"} w-full h-full`}
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className=" btn-circle text-2xl transition-all flex items-center justify-center btn-sm absolute top-2 right-2 bg-[var(--danger-color)] opacity-70 text-white  shadow hover:opacity-100"
            >
              <TiDeleteOutline className="flex" />
            </button>
          </div>
        ) : (
          <div
            className="flex flex-col justify-center items-center w-full h-full"
            onClick={() => fileInputRef.current.click()}
          >
            <FcAddImage className="text-6xl mb-4 text-[var(--primary-color)]" />
            <p className="text-[var(--primary-color)] text-lg">
              {name == "excelFile"
                ? t("click_choose_excel_file")
                : t("click_choose_image")}
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          id="imageInput"
          name={name}
          type="file"
          accept={
            name === "seeder_file"
              ? ".sql"
              : name === "env"
              ? ".env"
              : "image/*"
          }
          onChange={handleFileChange}
          className="absolute inset-0 hidden cursor-pointer"
        />
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm mt-1"
      />
    </>
  );
};

FileInputField.propTypes = {
  imagePreview: PropTypes.string,
  setImagePreview: PropTypes.func,
  setFieldValue: PropTypes.func,
  name: PropTypes.string,
  label: PropTypes.string,
  object_fit: PropTypes.string,
};
