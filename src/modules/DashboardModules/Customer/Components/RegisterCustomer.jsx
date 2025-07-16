import { useState } from "react";
import RegisterForm from "./RegisterForm";
import { Formik } from "formik";
import { Modal } from "../../../../components";
import { toast } from "react-toastify";
import { useMutate } from "../../../../hooks/useMatute";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

function RegisterCustomer({ employee }) {
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedRoleDisplay, setSelectedRoleDisplay] = useState("");

  const initialValues = {
    name: "",
    email: "",
    country_code: "",
    phone: "",
    password: "",
    password_confirmation: "",
    role: employee ? selectedRoleDisplay : "Client",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("الاسم مطلوب"),
    email: Yup.string()
      .email("صيغة البريد الإلكتروني غير صحيحة")
      .required("البريد الإلكتروني مطلوب"),
    country_code: Yup.string().required("رمز الدولة مطلوب"),
    phone: Yup.string()
      .required("رقم الهاتف مطلوب")
      .matches(
        /^5\d{8}$/,
        "رقم الجوال السعودي يجب أن يبدأ بـ 5 ويتكون من 9 أرقام"
      ),
    password: Yup.string()
      .required("كلمة المرور مطلوبة")
      .min(8, "كلمة المرور يجب أن تكون على الأقل 8 أحرف"),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref("password"), null], "كلمتا المرور غير متطابقتين")
      .required("تأكيد كلمة المرور مطلوب"),
    role: Yup.string().required("الرتبة مطلوبة"),
  });

  const { t } = useTranslation("layout");
  const [isOpen, setIsOpen] = useState(false);

  const { mutate, isPending } = useMutate({
    method: "POST",
    endpoint: "auth/register",
    queryKeysToInvalidate: ["customers"],
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
      btnText={employee ? t("Register_employee") : t("Register_customer")}
      btnClassName="text-base btn bg-[var(--primary-color)] hover:scale-[1.03] text-[var(--main-bg-color)] hover:text-[var(--primary-bg-color)] border-none"
      classNameModalStyle="max-w-[650px] w-full p-3"
    >
      <div>
        <h2 className="text-center text-2xl mb-3">
          {employee ? t("employee") : t("customer")}
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
              console.log("Validation Errors:", errors); // 🔥 LOG THE ERRORS
              return errors;
            }
          }}
        >
          {({ isSubmitting }) => (
            <RegisterForm
              isSubmitting={isPending || isSubmitting}
              submitButtonText="create"
              employee={employee}
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

export default RegisterCustomer;
