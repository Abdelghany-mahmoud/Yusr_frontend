import { useTranslation } from "react-i18next";
import { Modal, Button, TextArea } from "../../../../components";
import { useState } from "react";
import { toast } from "react-toastify";
import { FaBell } from "react-icons/fa";
import { useMutate } from "../../../../hooks/useMatute";
import { Form, Formik } from "formik";
import * as Yup from "yup";

const NotifyTeamModal = ({  transaction }) => {
  const { t } = useTranslation("layout");
const [ isOpen, setIsOpen ] = useState(false);

  const notesValidation = Yup.object({
    notes: Yup.string().required(t("notes_required")),
  });

   // Add notes mutation
    const { mutate: addNotes, isPending: isAddingNotes } = useMutate({
      method: "POST",
      endpoint: "transactions/add-notes",
      queryKeysToInvalidate: ["bank-transactions"],
    });
     const handleAddNotes = (values, { setSubmitting, resetForm }) => {
        addNotes(
          {
            transaction_id: selectedTransaction.id,
            notes: values.notes,
          },
          {
            onSuccess: (response) => {
              toast.success(response?.message || t("notes_added_successfully"));
              resetForm();
              refetch();
            },
            onError: (error) => {
              toast.error(error?.response?.data?.message || t("notes_add_failed"));
              setSubmitting(false);
            },
          }
        );
      };
  return (
    <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            btnText={
              <div
                className={"tooltip tooltip-info top "}
                data-tip={t("notify_team")}
              >
                <FaBell />
              </div>
            }
            btnClassName={
              "btn text-2xl btn-circle bg-[var(--primary-color)] text-[var(--secondary-color)] hover:bg-[var(--primary-color)] hover:scale-[1.07] btn-sm flex items-center justify-center"
            }
            classNameModalStyle={"max-w-[650px] w-full p-3"}
          >
      <div>
        <h2 className="text-center text-2xl mb-4">{t("notify_team")}</h2>
        <p className="text-center text-gray-600 mb-4">
          {t("transaction")} #{transaction?.id} - {transaction?.client?.user?.name}
        </p>
        <p className="text-center text-gray-600 mb-6">
          {t("notify_team_message")}
        </p>

          <Formik
                  initialValues={{ notes: "" }}
                  validationSchema={notesValidation}
                  onSubmit={handleAddNotes}
                >
                  {({ isSubmitting }) => (
                    <Form className="space-y-4">
                      <TextArea
                        name="notes"
                        label={t("internal_notes")}
                        placeholder={t("enter_internal_comments")}
                      />
      
                      <div className="flex gap-2 justify-end">
                        <Button
                          type="button"
                          onClick={() => setIsOpen(false)}
                          className="btn btn-secondary"
                          text={t("cancel")}
                        />
                        <Button
                          type="submit"
                          disabled={isAddingNotes || isSubmitting}
                          loading={isAddingNotes || isSubmitting}
                          className="btn btn-primary"
                          text={t("add_notes")}
                        />
                      </div>
                    </Form>
                  )}
                </Formik>

       
      </div>
    </Modal>
  );
};

export default NotifyTeamModal;
