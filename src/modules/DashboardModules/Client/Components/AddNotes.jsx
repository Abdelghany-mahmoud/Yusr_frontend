import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Button } from "../../../../components";
import { Formik, Form, Field } from "formik";
import { useMutate } from "../../../../hooks/useMutate";
import { toast } from "react-toastify";
import * as Yup from "yup";
import PropTypes from "prop-types";
import { DeleteGlobal } from "../../../../components";
import { useHasPermission } from "../../../../hooks/useHasPermission";
import { TbNotes } from "react-icons/tb";

function AddNotes({ client }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation("layout");
  const canViewNotes = useHasPermission("read-notes");
  const canDeleteNotes = useHasPermission("delete-notes");
  const canCreateNotes = useHasPermission("create-notes");

  const initialValues = {
    note: "",
    client_id: client?.id,
  };

  const validationSchema = Yup.object({
    client_id: Yup.number().required(),
    note: Yup.string().trim().required(t("note_required")),
  });

  // ✅ Add note mutation
  const { mutate: addNote, isPending } = useMutate({
    method: "POST",
    endpoint: "notes",
    queryKeysToInvalidate: ["notes"], // ensures refetch after add
  });

  const handleSubmit = (values, { resetForm, setSubmitting }) => {
    addNote(values, {
      onSuccess: (response) => {
        toast.success(response?.message);
        resetForm();
        setSubmitting(false); // ✅ make button available again
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || "Error occurred");
        setSubmitting(false); // ✅ allow retry
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      btnText={
        <div
          className="tooltip tooltip-info top text-[var(--secondary-text-color)]"
          data-tip={t("notes")}
        >
          <TbNotes />
        </div>
      }
      btnClassName="btn text-2xl btn-circle bg-[var(--primary-color)] hover:bg-[var(--primary-color)] text-[var(--secondary-color)] hover:scale-[1.07] btn-sm flex items-center justify-center"
      title={t("notes")}
      classNameModalStyle="max-w-[650px] w-full p-4"
    >
      {/* ✅ Existing notes (from client prop, synced via query) */}
      {canViewNotes && client.notes?.length > 0 ? (
        <div className="space-y-3 max-h-64 overflow-y-auto border p-3 rounded-md mb-6 bg-gray-50">
          {client.notes.map((note) => (
            <div
              key={note.id}
              className="p-3 bg-white rounded-lg shadow-sm border relative"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm text-gray-800">
                  {note.user?.name || t("unknown_user")}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(note.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-700">{note.note}</p>

              {/* ✅ Delete button (will trigger query invalidate) */}
              {canDeleteNotes &&
                <div className="absolute bottom-1 left-2">
                  <DeleteGlobal
                    endpoint={`notes/${note.id}`}
                    queryKey="notes"
                    text={note.note.slice(0, 20) + "..."}
                    tooltipText="delete"
                    deleteTitle={t("delete_note")}
                  />
                </div>}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic mb-6">
          {t("no_notes_available")}
        </p>
      )}

      {/* ✅ Add note form */}
      {canCreateNotes && <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => {
          const isLoading = isPending || isSubmitting;

          return (
            <Form className="space-y-4">
              <Field type="hidden" name="client_id" value={client?.id} />

              <div>
                <label className="block mb-1 font-medium">{t("add_note")}</label>
                <Field
                  as="textarea"
                  name="note"
                  rows="3"
                  placeholder={t("add_note")}
                  className="w-full textarea textarea-bordered resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                loading={isLoading}
                className="w-full btn bg-[var(--primary-color)] hover:scale-[1.03] text-[var(--main-bg-color)] border-none"
                text={t("save")}
              />
            </Form>
          );
        }}
      </Formik>}
    </Modal>
  );
}

AddNotes.propTypes = {
  client: PropTypes.shape({
    id: PropTypes.number.isRequired,
    notes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        note: PropTypes.string.isRequired,
        created_at: PropTypes.string.isRequired,
        user: PropTypes.shape({
          name: PropTypes.string,
        }),
      })
    ),
  }).isRequired,
};

export default AddNotes;
