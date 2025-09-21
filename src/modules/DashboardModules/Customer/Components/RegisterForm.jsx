import { Form, useFormikContext } from "formik";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { InputField } from "../../../../components/InputField/InputField";
import { Button, MultipleSelectionField, SelectField } from "../../../../components";
import { processRoleFields } from "../../../../Helpers/Helpers";
import { customerTypeOptions, } from "../../../../constant/customerType";
import { roleFields } from "../../../../constant/customerType";

function RegisterForm({
  isSubmitting,
  submitButtonText,
  employee,
  values
}) {
  const { t } = useTranslation("layout");
  const { setFieldValue } = useFormikContext();
  const selectedRoles = useMemo(
    () =>
      ([]).map((role) => ({
        value: role.name,
        label: t(role.name),
      })),
    [t]
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

  return (
    <Form className="space-y-4">
      <InputField
        name="name"
        label={t("name")}
        type="text"
        placeholder={t("enter_name")}
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

      {/* Roles Dropdown */}
      {employee ?
        (
          <>
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

            <MultipleSelectionField
              options={filteredRoles}
              values={values.roles}
              name="roles"
              setFieldValue={setFieldValue}
              totalPages={1}
              label={t("select_permissions")}
            />
          </>
        )
        :
        <SelectField
          name="financing_type"
          label={t("financing_type")}
          options={customerTypeOptions}
        />
      }

      <Button
        type="submit"
        disabled={isSubmitting}
        loading={isSubmitting}
        className="w-full btn bg-[var(--primary-color)] hover:scale-[1.03] text-[var(--main-bg-color)] border-none"
        text={t(submitButtonText)}
      />
    </Form>
  );
}

RegisterForm.propTypes = {
  isSubmitting: PropTypes.bool.isRequired,
  submitButtonText: PropTypes.string.isRequired,
  employee: PropTypes.bool,
  selectedRole: PropTypes.string,
  setSelectedRole: PropTypes.func,
  selectedRoleDisplay: PropTypes.string,
  setSelectedRoleDisplay: PropTypes.func,
  values: PropTypes.object.isRequired,
};

export default RegisterForm;
