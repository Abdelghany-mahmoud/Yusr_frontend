import { PropTypes } from "prop-types";
import { Modal } from "../index";
import { useState } from "react";
import { handleImageURL } from "../../Helpers/Helpers";
import { GrDocumentPdf } from "react-icons/gr";
import { LuEye } from "react-icons/lu";
import userImage from "/assets/images/user.jpg";

export const ModalShowImageAndPDF = ({ image, pdf, alt, title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const preview = pdf ? (
    <button
      onClick={() => setIsOpen(true)}
      className="w-full aspect-video flex items-center justify-center border rounded-md bg-gray-100 hover:bg-gray-200 transition"
    >
      <GrDocumentPdf className="text-4xl text-red-600" />
    </button>
  ) : (
    image && (
      <div
        className="relative group cursor-pointer w-full aspect-video overflow-hidden rounded-md"
        onClick={() => setIsOpen(true)}
      >
        <img
          className="object-cover w-full h-full"
          src={handleImageURL(image) || userImage}
          alt={alt || "Document image"}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-2xl transition">
          <LuEye />
        </div>
      </div>
    )
  );

  return (
    <>
      {preview}

      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        btnText={null}
        btnClassName=""
        classNameModalStyle={`${
          pdf ? "max-w-5xl" : "max-w-3xl"
        } w-full p-4 rounded-lg bg-white`}
      >
        <h3 className="text-xl font-semibold text-center mb-4">{title}</h3>

        {pdf ? (
          <div className="w-full h-[550px]">
            <iframe
              src={handleImageURL(pdf)}
              type="application/pdf"
              width="100%"
              height="100%"
              className="rounded-md border"
              title={title}
            />
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg">
            <img
              className="w-full h-full object-contain"
              src={handleImageURL(image) || userImage}
              alt={alt || "Document image"}
              loading="lazy"
            />
          </div>
        )}
      </Modal>
    </>
  );
};

ModalShowImageAndPDF.propTypes = {
  image: PropTypes.string,
  pdf: PropTypes.string,
  alt: PropTypes.string,
  title: PropTypes.string,
};
