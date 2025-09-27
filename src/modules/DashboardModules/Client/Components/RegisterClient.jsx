import { useState } from "react";
import RegisterForm from "./RegisterForm";
import { Formik } from "formik";
import { Modal } from "../../../../components";
import { toast } from "react-toastify";
import { useMutate } from "../../../../hooks/useMatute";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

function RegisterClient() {
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedRoleDisplay, setSelectedRoleDisplay] = useState("");
  const { t } = useTranslation("layout");
  const [isOpen, setIsOpen] = useState(false);

  const initialValues = {
    name: "",
    country_code: "966",
    phone: "",
    financing_type: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("الاسم مطلوب"),
    country_code: Yup.string().required("رمز الدولة مطلوب"),
    phone: Yup.string().required("رقم الهاتف مطلوب").matches(/^5\d{8}$/, "رقم الجوال السعودي يجب أن يبدأ بـ 5 ويتكون من 9 أرقام"),
    financing_type: Yup.string().required("التصنيف مطلوب"),
  });

  const { mutate, isPending } = useMutate({
    method: "POST",
    endpoint: "clients",
  });

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = (values, { setSubmitting }) => {
    mutate(values, {
      onSuccess: (response) => {
        toast.success(response?.message);
        handleClose();
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || "Error occurred");
        setSubmitting(false);
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      btnText={t("Register_client")}
      btnClassName="text-base btn bg-[var(--primary-color)] hover:scale-[1.03] text-[var(--main-bg-color)] hover:text-[var(--primary-bg-color)] border-none"
      classNameModalStyle="max-w-[650px] w-full p-3"
    >
      <div>
        <h2 className="text-center text-2xl mb-3">
          {t("Register_client")}
        </h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          validateOnBlur
          validateOnChange
          validate={(values) => {
            try {
              validationSchema.validateSync(values, { abortEarly: false });
              return {}; // No errors
            } catch (err) {
              const errors = {};
              if (err.inner) {
                err.inner.forEach((validationError) => {
                  errors[validationError.path] = validationError.message;
                });
              }
              return errors;
            }
          }}
        >
          {({ isSubmitting, values }) => (
            <RegisterForm
              isSubmitting={isPending || isSubmitting}
              submitButtonText="create"
              employee={false}
              values={values}
              selectedRole={selectedRole}
              setSelectedRole={setSelectedRole}
              selectedRoleDisplay={selectedRoleDisplay}
              setSelectedRoleDisplay={setSelectedRoleDisplay}
            />
          )}
        </Formik>
      </div>
    </Modal>
  );
}

export default RegisterClient;
