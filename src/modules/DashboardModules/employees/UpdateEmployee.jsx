import { useState } from "react";
import { Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import PropTypes from "prop-types";
import { FaEdit, FaFilter } from "react-icons/fa";
import { toast } from "react-toastify";
import { useMutate } from "./../../../hooks/useMatute";
import { Button } from "./../../../components/Button/Button";
import { Modal } from "./../../../components/Modal/Modal";
import { DropDownMenu, InputField } from "../../../components";
import { processRoleFields } from "../../../Helpers/Helpers";
import { roleFields } from "../../../constant/customerType";

function UpdateEmployee({ userAdmin }) {
  const { t } = useTranslation("layout");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(
    userAdmin?.roles?.[0]?.id || ""
  );
  const [selectedRoleDisplay, setSelectedRoleDisplay] = useState(
    userAdmin?.roles?.[0]?.name || ""
  );

  const initialValues = {
    user_id: userAdmin?.id || "",
    name: userAdmin?.name || "",
    email: userAdmin?.email || "",
    country_code: userAdmin?.country_code || "",
    phone: userAdmin?.phone || "",
    password: "",
    password_confirmation: "",
    role: selectedRoleDisplay || "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(t("name_required") || "الاسم مطلوب"),
    email: Yup.string()
      .email(t("invalid_email") || "صيغة البريد الإلكتروني غير صحيحة")
      .required(t("email_required") || "البريد الإلكتروني مطلوب"),
    country_code: Yup.string().required(
      t("country_code_required") || "رمز الدولة مطلوب"
    ),
    phone: Yup.string()
      .required(t("phone_required") || "رقم الهاتف مطلوب")
      .matches(
        /^5\d{8}$/,
        t("invalid_phone") ||
          "رقم الجوال السعودي يجب أن يبدأ بـ 5 ويتكون من 9 أرقام"
      ),
    password: Yup.string(), // Optional for update
    password_confirmation: Yup.string().oneOf(
      [Yup.ref("password"), null],
      t("passwords_must_match") || "كلمتا المرور غير متطابقتين"
    ),
    role: Yup.string().required(t("role_required") || "الرتبة مطلوبة"),
  });

  const { mutate, isPending } = useMutate({
    method: "POST",
    endpoint: `users/update-account`,
    queryKeysToInvalidate: ["employees"],
  });

  const handleSubmit = (values, { setSubmitting }) => {
    mutate(values, {
      onSuccess: (response) => {
        toast.success(response?.message);
        setIsOpen(false);
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || "Error occurred");
        setSubmitting(false);
      },
    });
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        btnText={
          <div className={"tooltip tooltip-info top  "} data-tip={t("update")}>
            <FaEdit className="p-1" />
          </div>
        }
        btnClassName={
          "btn text-2xl btn-circle bg-[var(--primary-color)] text-[var(--secondary-color)] hover:bg-[var(--primary-color)] hover:scale-[1.07] btn-sm flex items-center justify-center"
        }
        classNameModalStyle={"max-w-[650px] w-full p-3"}
      >
        <div>
          <h2 className="text-center text-2xl mb-3">{t("update_employee")}</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
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
            {({ isSubmitting, setFieldValue, values }) => (
              <Form className="space-y-4">
                <InputField
                  name="name"
                  label={t("name")}
                  type="text"
                  placeholder={t("enter_name")}
                />
                <InputField
                  name="email"
                  label={t("email")}
                  type="email"
                  placeholder={t("enter_email")}
                />
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    name="country_code"
                    label={t("country_code")}
                    type="text"
                    placeholder="+2"
                  />
                  <InputField
                    name="phone"
                    label={t("phone")}
                    type="tel"
                    placeholder={t("enter_phone")}
                  />
                </div>
                <InputField
                  name="password"
                  label={t("password")}
                  type="password"
                  placeholder={t("enter_password")}
                />
                <InputField
                  name="password_confirmation"
                  label={t("password_confirmation")}
                  type="password"
                  placeholder={t("enter_password_confirmation")}
                />
                <DropDownMenu
                  menuTitle={t("choose_role")}
                  MenuIcon={<FaFilter />}
                  className="px-4 py-2 rounded-md w-full"
                  selectedValue={t(selectedRoleDisplay)}
                >
                  <li
                    onClick={() => {
                      setSelectedRole("");
                      setSelectedRoleDisplay("");
                      setFieldValue("role", ""); // ✅ sync to Formik
                    }}
                    className={`cursor-pointer p-2 hover:bg-[var(--bg-hover)] ${
                      selectedRole === "" ? "bg-[var(--bg-hover)]" : ""
                    }`}
                  >
                    {t("all")}
                  </li>

                  {processRoleFields(roleFields)
                    .filter((role) => role.displayLabel !== "Client")
                    .map((role) => (
                      <li
                        key={role.id}
                        onClick={() => {
                          setSelectedRole(role.id);
                          setSelectedRoleDisplay(role.displayLabel);
                          setFieldValue("role", role.id); // ✅ sync to Formik
                        }}
                        className={`cursor-pointer p-2 hover:bg-[var(--bg-hover)] ${
                          selectedRole === role.id ? "bg-[var(--bg-hover)]" : ""
                        }`}
                      >
                        {t(role.displayLabel)}
                      </li>
                    ))}
                </DropDownMenu>

                {/* Hidden input to make Formik track the role field */}
                <input type="hidden" name="role" value={values.role} />

                <Button
                  type="submit"
                  disabled={isPending || isSubmitting}
                  loading={isPending || isSubmitting}
                  className="w-full btn bg-[var(--primary-color)] hover:scale-[1.03] text-[var(--main-bg-color)] border-none"
                  text={t("update")}
                />
              </Form>
            )}
          </Formik>
        </div>
      </Modal>
    </>
  );
}

UpdateEmployee.propTypes = {
  userAdmin: PropTypes.object.isRequired,
};

export default UpdateEmployee;
