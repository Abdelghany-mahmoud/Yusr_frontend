import { useState, useMemo } from "react";
import { Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import PropTypes from "prop-types";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import { useMutate } from "./../../../hooks/useMatute";
import {
  Button,
  Modal,
  InputField,
  MultipleSelectionField,
} from "../../../components";
import { processRoleFields } from "../../../Helpers/Helpers";
import { roleFields } from "../../../constant/customerType";

function UpdateEmployee({ userAdmin }) {
  const { t } = useTranslation("layout");
  const [isOpen, setIsOpen] = useState(false);

  const selectedRoles = useMemo(
    () =>
      (userAdmin?.roles || []).map((role) => ({
        value: role.name,
        label: t(role.name),
      })),
    [userAdmin, t]
  );

  const allRoles = useMemo(
    () =>
      processRoleFields(roleFields).map((role) => ({
        value: role.displayLabel,
        label: t(role.displayLabel),
      })),
    [t]
  );

  const filteredRoles = useMemo(() => {
    const selectedValues = selectedRoles.map((r) => r.value);
    return allRoles.filter(
      (role) => role.value !== "Client" && !selectedValues.includes(role.value)
    );
  }, [allRoles, selectedRoles]);

  const initialValues = {
    user_id: userAdmin?.id || "",
    name: userAdmin?.name || "",
    email: userAdmin?.email || "",
    country_code: userAdmin?.country_code || "",
    phone: userAdmin?.phone || "",
    password: "",
    password_confirmation: "",
    roles: selectedRoles,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(t("name_required")),
    email: Yup.string()
      .email(t("invalid_email"))
      .required(t("email_required")),
    country_code: Yup.string().required(t("country_code_required")),
    phone: Yup.string()
      .required(t("phone_required"))
      .matches(/^5\d{8}$/, t("invalid_phone")),
    password: Yup.string(),
    password_confirmation: Yup.string().oneOf(
      [Yup.ref("password"), null],
      t("passwords_must_match")
    ),
    roles: Yup.array().min(1, t("role_required")),
  });

  const { mutate, isPending } = useMutate({
    method: "POST",
    endpoint: `users/update-account`,
    queryKeysToInvalidate: ["employees"],
  });

  const handleSubmit = (values, { setSubmitting }) => {
    const payload = {
      ...values,
      roles: values.roles.map((role) => role.value),
    };

    mutate(payload, {
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
          <div className="tooltip tooltip-info top" data-tip={t("update")}>
            <FaEdit className="p-1" />
          </div>
        }
        btnClassName="btn text-2xl btn-circle bg-[var(--primary-color)] text-[var(--secondary-color)] hover:bg-[var(--primary-color)] hover:scale-[1.07] btn-sm flex items-center justify-center"
        classNameModalStyle="max-w-[650px] w-full p-3"
      >
        <h2 className="text-center text-2xl mb-3">{t("update_employee")}</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
          validateOnBlur
          validateOnChange
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="space-y-4">
              <InputField name="name" label={t("name")} type="text" placeholder={t("enter_name")} />
              <InputField name="email" label={t("email")} type="email" placeholder={t("enter_email")} />
              <div className="grid grid-cols-2 gap-4">
                <InputField name="country_code" label={t("country_code")} type="text" placeholder="+2" />
                <InputField name="phone" label={t("phone")} type="tel" placeholder={t("enter_phone")} />
              </div>
              <InputField name="password" label={t("password")} type="password" placeholder={t("enter_password")} />
              <InputField name="password_confirmation" label={t("password_confirmation")} type="password" placeholder={t("enter_password_confirmation")} />

              <MultipleSelectionField
                options={filteredRoles}
                values={values.roles}
                name="roles"
                setFieldValue={setFieldValue}
                totalPages={1}
                label={t("permissions")}
              />

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
      </Modal>
    </>
  );
}

UpdateEmployee.propTypes = {
  userAdmin: PropTypes.object.isRequired,
};

export default UpdateEmployee;
