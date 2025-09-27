import { format } from "date-fns";
import {
  ModalShowImageAndPDF,
  ModelPagination,
} from "../../../../../components";

export const ClientDocuments = ({
  clientDocs,
  isClientDocsLoading,
  page,
  setPage,
  t,
}) => {
  if (isClientDocsLoading || !clientDocs?.data?.data?.length) return null;

  const docs = clientDocs.data.data;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold border-b pb-2">{t("documents")}</h3>

      {/* === Images Section === */}
      {docs.some((doc) => doc.images?.length) && (
        <div className="space-y-4">
          <h4 className="text-md font-medium">{t("image_documents")}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {docs.map((doc) =>
              doc.images?.map(
                (image, index) =>
                  image && (
                    <div
                      key={`${doc.id}-image-${index}`}
                      className="bg-white rounded-lg shadow p-4 space-y-2"
                    >
                      <ModalShowImageAndPDF
                        image={image}
                        alt="document-image"
                        title={t("image_document")}
                      />
                      <p className="text-xs text-gray-500">
                        {t("uploaded_at")}:{" "}
                        {format(new Date(doc.created_at), "yyyy-MM-dd HH:mm")}
                      </p>
                    </div>
                  )
              )
            )}
          </div>
        </div>
      )}

      {/* === PDFs Section === */}
      {docs.some((doc) => doc.pdfs?.length) && (
        <div className="space-y-4">
          <h4 className="text-md font-medium">{t("pdf_documents")}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {docs.map((doc) =>
              doc.pdfs?.map(
                (pdf, index) =>
                  pdf && (
                    <div
                      key={`${doc.id}-pdf-${index}`}
                      className="bg-white rounded-lg shadow p-4 space-y-2"
                    >
                      <ModalShowImageAndPDF
                        pdf={pdf}
                        title={t("pdf_document")}
                      />
                      <p className="text-xs text-gray-500">
                        {t("uploaded_at")}:{" "}
                        {format(new Date(doc.created_at), "yyyy-MM-dd HH:mm")}
                      </p>
                    </div>
                  )
              )
            )}
          </div>
        </div>
      )}

      {/* === Pagination === */}
      <div className="flex justify-center pt-4">
        <ModelPagination
          currentPage={page}
          totalPages={clientDocs?.data?.last_page || 1}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};
