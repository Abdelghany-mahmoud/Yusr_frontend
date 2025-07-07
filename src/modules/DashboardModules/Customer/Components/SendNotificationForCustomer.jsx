import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { languageState } from "../../../../store/langAtom/languageAtom";
import { useMutate } from "../../../../hooks/useMatute";
import { Button, FileInputField, InputField, Modal, TextArea } from "../../../../components";
import { IoIosNotifications } from "react-icons/io";
import { Form, Formik } from "formik";
import { validationNotification } from "../Validation/NotificationSchema";
import { toast } from "react-toastify";

function SendNotificationForCustomer() {
  const [isOpen, setIsOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const { t } = useTranslation("layout");
  const lang = useRecoilValue(languageState);

  const { mutate, isPending } = useMutate({
    method: "POST",
    endpoint: "notifications/send-notification-to-all",
    queryKeysToInvalidate: ["customer-notifications"],
  });

  const initialValues = {
    title: "",
    message: "",
    image: "",
  };
  useEffect(() => {
    if (!isOpen) {
      setImagePreview(null);
    }
  }, [isOpen]);

  const AddNotificationHandler = async (
    values,
    { resetForm, setSubmitting }
  ) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("message", values.message);
    formData.append("image", values.image);
    selectedIds.forEach((id, index) => {
      formData.append(`recipientIds[${index}]`, id.id);
    });
    mutate(formData, {
      onSuccess: (response) => {
        toast.success(response?.message);
        setSelectedIds([]);
        resetForm();
        setSubmitting(false);
        setIsOpen(false);
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message);
      },
    });
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        btnText={
          <button className="text-base btn bg-yellow-400 hover:bg-yellow-500 hover:scale-[1.03] text-gray-900 flex items-center gap-2 border-none">
            <span>{t("send_notification")}</span>
            <IoIosNotifications className="text-2xl" />
          </button>
        }
        classNameModalStyle={"max-w-[600px] w-full p-3"}
      >
        <div>
          <h2 className="text-center text-2xl mb-3">
            {t("send_notification_to_selected_Customers")}
          </h2>
          <div>
            <Formik
              initialValues={initialValues}
              validationSchema={validationNotification(lang)}
              onSubmit={AddNotificationHandler}
            >
              {({ isSubmitting, setFieldValue }) => (
                <Form className="space-y-4">
                  <div className=" sm:w-2/3 mx-auto">
                    <FileInputField
                      setFieldValue={setFieldValue}
                      imagePreview={imagePreview}
                      setImagePreview={setImagePreview}
                      name="image"
                      label={t("notification_image")}
                      accept="image/*"
                    />
                  </div>
                  <div>
                    <InputField
                      name="title"
                      label={t("notification_title")}
                      type="text"
                      placeholder={t("notification_title")}
                    />
                  </div>

                  <div>
                    <TextArea
                      name={"message"}
                      label={t("notification_message")}
                      placeholder={t("notification_message")}
                    />
                  </div>

                  <div className="text-white gap-2">
                    <Button
                      disabled={isSubmitting || isPending}
                      type="submit"
                      className="font-semibold bg-[var(--primary-color)] w-full transition-all"
                      text={t("send_notification")}
                      loading={isSubmitting || isPending}
                    />
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default SendNotificationForCustomer;
