import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  Button,
  FileUploadField,
  InputField,
  Pagination,
} from "../../../../components";
import PropTypes from 'prop-types';
import { useLocation } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useMutate } from "../../../../hooks/useMatute";
import { useGetData } from "../../../../hooks/useGetData";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Form, Formik } from "formik";
import { useRecoilValue } from "recoil";
import { tokenAtom } from "../../../../store/tokenAtom/tokenAtom";
import { handleImageURL } from "../../../../Helpers/Helpers";

function TransactionProgress({ transaction, userId }) {
  const { t } = useTranslation("layout");
  const token = useRecoilValue(tokenAtom);
  const [selectedRole, setSelectedRole] = useState(null);
  const [activeTab, setActiveTab] = useState("notes");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [note, setNote] = useState("");
  const [employeeNotesPage, setEmployeeNotesPage] = useState(1);
  const [clientNotesPage, setClientNotesPage] = useState(1);
  const [hasMoreEmployeeNotes, setHasMoreEmployeeNotes] = useState(true);
  const [hasMoreClientNotes, setHasMoreClientNotes] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // console.log(transaction.client[selectedRole?.key], "transaction");

  const { data: notesFromEmployee, isLoading: notesLoading } = useGetData({
    endpoint: `notes?&sender_id=${transaction.client[selectedRole?.key]}&receiver_id=${userId}&transaction_id=${transaction?.id}&page=${employeeNotesPage}`,
    queryKey: [
      `client-noteFromEmp-${userId}-${transaction.client[selectedRole?.key]
      }-${employeeNotesPage}-${transaction?.id}`,
    ],
    enabledKey: !!transaction.client[selectedRole?.key],
  });

  const { data: notesFromClient, isLoading: notesClientLoading } = useGetData({
    endpoint: `notes?transaction_id=${transaction?.id}&receiver_id=${transaction.client[selectedRole?.key]
      }&sender_id=${userId}&transaction_id=${transaction?.id
      }&page=${clientNotesPage}`,
    queryKey: [
      `client-notes-${userId}-${transaction.client[selectedRole?.key]
      }-${clientNotesPage}-${transaction?.id}`,
    ],
    enabledKey: !!transaction.client[selectedRole?.key],
  });
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentPage = parseInt(searchParams.get("page")) || 1;

  const { data: clientDocs, isLoading: clientDocsLoading } = useGetData({
    endpoint: `documents?client_id=${token?.user?.client?.id}&page=${currentPage}`,
    queryKey: [`client-docs-${userId}-${currentPage}`],
    enabledKey: !!token?.user?.client?.id,
  });

  useEffect(() => {
    if (notesFromClient?.data?.last_page <= clientNotesPage) {
      setHasMoreClientNotes(false);
    }
    if (notesFromEmployee?.data?.last_page <= employeeNotesPage) {
      setHasMoreEmployeeNotes(false);
    }
  }, [notesFromClient, notesFromEmployee, clientNotesPage, employeeNotesPage]);

  const loadMoreNotes = () => {
    if (hasMoreEmployeeNotes) {
      setEmployeeNotesPage((prev) => prev + 1);
    }
    if (hasMoreClientNotes) {
      setClientNotesPage((prev) => prev + 1);
    }
  };

  const { mutate: sendNote, isLoading: isSendingNote } = useMutate({
    method: "post",
    endpoint: `notes`,
    queryKeysToInvalidate: ["client-transactions"],
  });

  const { mutate: uploadDocument, isLoading: isUploading } = useMutate({
    method: "post",
    endpoint: `documents`,
    queryKeysToInvalidate: ["client-docs"],
  });

  const roles = [
    { id: "frontline", name: "Frontline Liaison Officer", key: "frontline_liaison_officer_id", },
    { id: "main_case", name: "Main Case Handler", key: "main_case_handler_id" },
    { id: "financial", name: "Financial Officer", key: "financial_officer_id" },
    { id: "executive", name: "Executive Director", key: "executive_director_id", },
    { id: "legal", name: "Legal Supervisor", key: "legal_supervisor_id" },
    { id: "quality", name: "Quality Assurance Officer", key: "quality_assurance_officer_id", },
    { id: "bank", name: "Bank Liaison Officer", key: "bank_liaison_officer_id", },
  ];

  const getRoleStatus = (role) => {
    if (!transaction) return "Pending";

    const statusHistory = transaction.status_history || [];
    const roleId = transaction.client[role.key];
    if (roleId) return "Approved"; // If assigned, considered approved

    const roleStatuses = statusHistory.filter((sh) => {
      const statusParts = sh.status.toLowerCase().split("_");
      return statusParts[0] === role.id.toLowerCase();
    });

    if (roleStatuses.length === 0) return "Pending";

    const latestStatus = roleStatuses[roleStatuses.length - 1];
    const parts = latestStatus.status.split("_");
    const action = parts[parts.length - 1]; // Get last item as action

    if (action === "Approved") return "Approved";
    if (action === "Cancelled") return "Cancelled";
    return "in_progress";
  };

  const handleRoleClick = (role) => {
    const roleId = transaction.client[role.key];
    setSelectedRole({ ...role, id: roleId || role.id });
    setIsModalOpen(true);
  };

  const handleNoteSend = () => {
    if (!note.trim()) return;

    sendNote(
      {
        note,
        receiver_id: transaction.client[selectedRole?.key],
        transaction_id: transaction?.id,
      },
      {
        onSuccess: () => {
          setNote("");
          // Optionally close modal or show success message
        },
      }
    );
  };

  const validationSchema = Yup.object({
    documents: Yup.array()
      .of(Yup.mixed().required())
      .min(1, "At least one document is required")
      .required("Documents are required"),
    fileNames: Yup.array()
      .of(Yup.string().required("File name is required"))
      .test(
        "match-length",
        "File names must match number of documents",
        function (value) {
          return (
            value &&
            this.parent.documents &&
            value.length === this.parent.documents.length
          );
        }
      ),
  });

  const handleFileUpload = (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    let imageIndex = 0;
    let pdfIndex = 0;
    formData.append("client_id", token?.user?.client?.id);
    values.documents.forEach((file, index) => {
      if (file.type.startsWith("image/")) {
        formData.append(`images[]`, file);
        formData.append(`image_names[${imageIndex}]`, values.fileNames[index]);
        imageIndex++;
      } else if (file.type === "application/pdf") {
        formData.append(`pdfs[]`, file);
        formData.append(`pdf_names[${pdfIndex}]`, values.fileNames[index]);
        pdfIndex++;
      }
    });

    uploadDocument(formData, {
      onSuccess: (response) => {
        toast.success(response?.message);
        setSelectedFiles([]);
        resetForm();
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || "Error occurred");
        setSubmitting(false);
      },
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-500";
      case "in_progress":
        return "bg-blue-500";
      case "Cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-300";
    }
  };

  // Add payment receipts tab if bank role is selected
  const showPaymentReceiptsTab =
    selectedRole?.name === "Bank Liaison Officer" &&
    transaction.payment_receipts.length > 0;

  const showNotesTab = false;

  // console.log(transaction, "transaction");
  // console.log(selectedRole, "selectedRole?.id");
  return (
    <div className="relative">
      {/* Progress Line */}
      <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200" />

      {/* Role Steps */}
      <div className="relative flex justify-between">
        {roles.map((role, index) => {
          const status = getRoleStatus(role);
          return (
            <div key={role.id} className="flex flex-col items-center">
              <button
                onClick={() => handleRoleClick(role)}
                className={`w-10 h-10 rounded-full ${getStatusColor(status)} 
                  text-white flex items-center justify-center relative z-10 
                  transition-transform hover:scale-110 focus:outline-none`}
              >
                {status === "Approved" ? (
                  <FaCheckCircle className="w-6 h-6" />
                ) : status === "Cancelled" ? (
                  <FaTimesCircle className="w-6 h-6" />
                ) : (
                  index + 1
                )}
              </button>
              <span className="mt-2 text-sm text-center w-24">
                {t(role.name)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Role Details Modal */}
      <Modal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        title={selectedRole?.name}
        classNameModalStyle="max-w-2xl w-full"
      >
        <div className="space-y-4">
          {/* Tabs */}
          <div className="flex space-x-4 border-b">

            {showNotesTab && (
              <button
                className={`py-2 px-4 ${activeTab === "notes" ? "border-b-2 border-blue-500" : ""
                  }`}
                onClick={() => setActiveTab("notes")}
              >
                {t("notes")}
              </button>
            )}

            <button
              className={`py-2 px-4 ${activeTab === "documents" ? "border-b-2 border-blue-500" : ""
                }`}
              onClick={() => setActiveTab("documents")}
            >
              {t("documents")}
            </button>

            {showPaymentReceiptsTab && (
              <button
                className={`py-2 px-4 ${activeTab === "payment_receipts"
                  ? "border-b-2 border-blue-500"
                  : ""
                  }`}
                onClick={() => setActiveTab("payment_receipts")}
              >
                {t("payment_receipts")}
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {activeTab === "notes" && showNotesTab ? (
              <div className="space-y-4">
                <div className="space-y-4">
                  {[
                    ...(notesFromEmployee?.data?.data || []),
                    ...(notesFromClient?.data?.data || []),
                  ]
                    .sort(
                      (a, b) => new Date(a.created_at) - new Date(b.created_at)
                    )
                    .map((note) => {
                      const isCurrentUser = note.sender_id === userId;
                      return (
                        <div
                          key={note.id}
                          className={`p-4 rounded-lg max-w-[80%] ${isCurrentUser ? "ml-auto bg-blue-100" : "bg-gray-50"
                            }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium">{note.sender.name}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(note.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-600">{note.note}</p>
                        </div>
                      );
                    })}
                  {(notesLoading || notesClientLoading) && (
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                  {!notesFromEmployee?.data?.data?.length &&
                    !notesFromClient?.data?.data?.length && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-600">
                          {t("no_notes_available")}
                        </p>
                      </div>
                    )}
                </div>
                {(hasMoreEmployeeNotes || hasMoreClientNotes) && (
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={loadMoreNotes}
                      className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800"
                      disabled={notesLoading || notesClientLoading}
                    >
                      {t("load_more")}
                    </button>
                  </div>
                )}
                <div className="mt-4">
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="h-20 textarea w-full p-2 border border-slate-300  text-black"
                    placeholder={t("add_note")}
                    rows="3"
                  />
                  <Button
                    onClick={handleNoteSend}
                    loading={isSendingNote}
                    text={t("send")}
                    className="mt-2 p-2 bg-blue-500 text-white"
                  />
                </div>
              </div>
            ) : activeTab === "documents" ? (
              <div className="space-y-4">
                <Formik
                  initialValues={{
                    documents: [],
                    fileNames: [],
                  }}
                  validationSchema={validationSchema}
                  onSubmit={handleFileUpload}
                >
                  {({ setFieldValue, values, isSubmitting }) => (
                    <Form className="space-y-4">
                      <FileUploadField
                        name="documents"
                        label={t("documents")}
                        accept=".pdf,.jpg,.jpeg,.png"
                        selectedFiles={selectedFiles}
                        setSelectedFiles={(files) => {
                          setSelectedFiles(files);
                          setFieldValue("documents", files);
                          setFieldValue(
                            "fileNames",
                            files.map((f) => "")
                          );
                        }}
                        setFieldValue={setFieldValue}
                        multiple
                      />

                      {selectedFiles.map((file, index) => (
                        <InputField
                          key={`fileName-${index}`}
                          name={`fileNames.${index}`}
                          label={`${file.type.startsWith("image/") ? "Image" : "PDF"
                            } ${index + 1} Name`}
                          placeholder={`Enter name for ${file.name}`}
                          type="text"
                        />
                      ))}

                      <Button
                        type="submit"
                        disabled={isUploading || isSubmitting}
                        loading={isUploading || isSubmitting}
                        text={t("upload")}
                        className="mt-2 p-2 bg-blue-500 text-white"
                      />
                    </Form>
                  )}
                </Formik>
                {(hasMoreEmployeeNotes || hasMoreClientNotes) && (
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={loadMoreNotes}
                      className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800"
                      disabled={notesLoading || notesClientLoading}
                    >
                      {t("load_more")}
                    </button>
                  </div>
                )}
                <div className="mt-4">
                  <div className="space-y-2">
                    {clientDocsLoading ? (
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      </div>
                    ) : clientDocs?.data?.data?.length === 0 ? (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-600">
                          {t("no_documents_available")}
                        </p>
                      </div>
                    ) : (
                      <>
                        {clientDocs?.data?.data?.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {t("document")}
                              </span>
                              <span className="text-sm text-gray-500">
                                {new Date(doc.created_at).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              {doc.images.map((image, index) => (
                                <Button
                                  key={`image-${index}`}
                                  text={t("view_image")}
                                  className="text-blue-500 hover:text-blue-700"
                                  onClick={() =>
                                    window.open(handleImageURL(image), "_blank")
                                  }
                                />
                              ))}
                              {doc.pdfs.map((pdf, index) => (
                                <Button
                                  key={`pdf-${index}`}
                                  text={t("view_pdf")}
                                  className="text-blue-500 hover:text-blue-700"
                                  onClick={() =>
                                    window.open(handleImageURL(pdf), "_blank")
                                  }
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                        <Pagination
                          totalPages={clientDocs?.data?.last_page || 1}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : activeTab === "payment_receipts" && showPaymentReceiptsTab ? (
              <div className="space-y-4">
                {transaction.payment_receipts.map((receipt, receiptIdx) => (
                  <div key={receipt.id || receiptIdx} className="mb-4">
                    <div className="font-bold mb-2">
                      {t("payment_receipt")} #{receiptIdx + 1}
                    </div>
                    <div className="space-y-2">
                      {receipt.files.map((file, idx) => (
                        <div
                          key={file}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <div>
                            <span className="block text-sm text-gray-500">
                              {receipt.details?.[idx]?.note && (
                                <>
                                  <p className="mr-2 font-medium">
                                    {receipt.details[idx].note}
                                  </p>
                                  <span className="text-xs text-gray-400 ml-2">
                                    {receipt.details[idx].uploaded_at ||
                                      receipt.details[idx].added_at}
                                  </span>
                                </>
                              )}
                            </span>
                          </div>
                          <Button
                            text={t("view_receipt")}
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() =>
                              window.open(handleImageURL(file), "_blank")
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </Modal>
    </div>
  );
}

TransactionProgress.propTypes = {
  transaction: PropTypes.object.isRequired, // Or shape({ ... }) for stricter validation
  userId: PropTypes.number.isRequired,      // Or PropTypes.number, depending on type
};

export default TransactionProgress;
