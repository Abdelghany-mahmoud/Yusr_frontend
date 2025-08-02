import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutate } from "../../../hooks/useMatute";
import { useSendToWhatsapp } from "../../../hooks/useSendToWhatsapp";
import { toast } from "react-toastify";
import { Modal } from "../../../components";
import { MdOutlineNoteAdd } from "react-icons/md";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { InputField } from "../../../components/InputField/InputField";
import { Button } from "../../../components/Button/Button";

function SendNoteForEmployee({ userId }) {
  const { t } = useTranslation("layout");
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: sendWhatsapp } = useSendToWhatsapp();
  const { mutate, isPending } = useMutate({
    method: "POST",
    endpoint: `notes`,
    queryKeysToInvalidate: ["employees"],
  });

  const initialValues = {
    note: "",
    receiver_id: userId,
  };

  const validationSchema = Yup.object({
    note: Yup.string().required(t("note_required")),
  });

  const handleSubmit = (values, { resetForm }) => {
    mutate(
      { ...values },
      {
        onSuccess: () => {
          setIsOpen(false);
          resetForm();
          sendWhatsapp(
            {
              user_id: userId,
              message: values.note,
            },
            {
              onSuccess: (data) => {
                toast.success(data?.message);
              },
              onError: (error) => {
                toast.error(error?.response?.data?.message);
              },
            }
          );
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
          className="tooltip tooltip-info top text-[var(--secondary-text-color)]"
          data-tip={t("add_note")}
        >
          <MdOutlineNoteAdd />
        </div>
      }
      btnClassName="btn text-2xl btn-circle bg-[var(--primary-color)] hover:bg-[var(--primary-color)] text-[var(--secondary-color)] hover:scale-[1.07] btn-sm flex items-center justify-center"
      classNameModalStyle="max-w-[650px] w-full p-3"
      title={t("add_note")}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="note"
              label={t("note")}
              type="text"
              placeholder={t("add_note")}
            />
            <div className="mt-4 flex justify-end">
              <Button
                type="submit"
                text={t("send")}
                loading={isPending || isSubmitting}
                className="bg-blue-500 text-white px-6"
              />
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

export default SendNoteForEmployee;
