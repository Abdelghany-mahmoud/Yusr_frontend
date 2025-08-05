import { Form, useFormikContext } from "formik";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { InputField } from "../../../../components/InputField/InputField";
import { Button, DropDownMenu, SelectField } from "../../../../components";
import { FaFilter } from "react-icons/fa";
import { processRoleFields } from "../../../../Helpers/Helpers";
import { customerTypeOptions, roleFields } from "../../../../constant/customerType";

function RegisterForm({
  isSubmitting,
  submitButtonText,
  employee,
  selectedRole,
  setSelectedRole,
  selectedRoleDisplay,
  setSelectedRoleDisplay,
}) {
  const { t } = useTranslation("layout");
  const { setFieldValue } = useFormikContext();

  return (
    <Form className="space-y-4">
      <InputField
        name="name"
        label={t("name")}
        type="text"
        placeholder={t("enter_name")}
      />

      {/* <InputField
        name="email"
        label={t("email")}
        type="email"
        placeholder={t("enter_email")}
      /> */}

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

      <SelectField
        name="financing_type"
        label={t("financing_type")}
        options={customerTypeOptions}
      />

      {/* <InputField
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
      /> */}

      {/* Roles Dropdown */}
      {employee && (
        <>
          <input type="hidden" name="role" />
          <DropDownMenu
            menuTitle={t("choose_role")}
            MenuIcon={<FaFilter />}
            className="px-4 py-2 rounded-md w-full"
            selectedValue={t(selectedRoleDisplay)}
          >
            <li
              onClick={() => {
                setSelectedRole("");
                setSelectedRoleDisplay(t("all"));
                setFieldValue("role", ""); // ✅ Sync with Formik
              }}
              className={`cursor-pointer p-2 hover:bg-[var(--bg-hover)] ${selectedRole === "" ? "bg-[var(--bg-hover)]" : ""
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
                    setSelectedRole(role.displayLabel);
                    setSelectedRoleDisplay(role.displayLabel);
                    setFieldValue("role", role.displayLabel); // ✅ Sync with Formik
                  }}
                  className={`cursor-pointer p-2 hover:bg-[var(--bg-hover)] ${selectedRole === role.id ? "bg-[var(--bg-hover)]" : ""
                    }`}
                >
                  {t(role.displayLabel)}
                </li>
              ))}
          </DropDownMenu>
        </>
      )}

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
};

export default RegisterForm;
