import { useState } from "react";
import RegisterForm from "../Client/Components/RegisterForm";
import { Formik } from "formik";
import { Modal } from "../../../components";
import { toast } from "react-toastify";
import { useMutate } from "../../../hooks/useMutate";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

function RegisterEmployee() {
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedRoleDisplay, setSelectedRoleDisplay] = useState("");
  const { t } = useTranslation("layout");
  const [isOpen, setIsOpen] = useState(false);

  const initialValues = {
    name: "",
    country_code: "966",
    phone: "",
    password: "",
    password_confirmation: "",
    roles: [],
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("الاسم مطلوب"),
    country_code: Yup.string().required("رمز الدولة مطلوب"),
    phone: Yup.string().required("رقم الهاتف مطلوب").matches(/^5\d{8}$/, "رقم الجوال السعودي يجب أن يبدأ بـ 5 ويتكون من 9 أرقام"),
    password: Yup.string().required("كلمة المرور مطلوبة").min(8, "كلمة المرور يجب أن تكون على الأقل 8 أحرف"),
    password_confirmation: Yup.string().required("تأكيد كلمة المرور مطلوبة").oneOf([Yup.ref("password"), null], "كلمتا المرور غير متطابقتين"),
    roles: Yup.array().min(1, t("role_required")),
  });

  const { mutate, isPending } = useMutate({
    method: "POST",
    endpoint: "employees/create",
  });

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const payload = {
      ...values,
      roles: values.roles.map((r) => r.value),  // ✅ extract only values
    };

    mutate(payload, {
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
      btnText={t("Register_employee")}
      btnClassName="text-base btn bg-[var(--primary-color)] hover:scale-[1.03] text-[var(--main-bg-color)] hover:text-[var(--primary-bg-color)] border-none"
      classNameModalStyle="max-w-[650px] w-full p-3"
    >
      <div>
        <h2 className="text-center text-2xl mb-3">
          {t("Register_employee")}
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
              employee={true}
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

export default RegisterEmployee;
