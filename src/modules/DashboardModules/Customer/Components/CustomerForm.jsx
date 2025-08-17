import { Form, useFormikContext, useField } from "formik";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { customerTypeOptions } from "../../../../constant/customerType";
import { InputField, SelectField } from "../../../../components";

const CheckboxField = ({ name, label }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField({ name, type: "checkbox" });

  const handleChange = (e) => {
    setFieldValue(name, e.target.checked ? 1 : 0);
  };

  return (
    <div className="flex items-center gap-2 col-span-2 md:col-span-1">
      <input
        type="checkbox"
        checked={field.value === 1}
        onChange={handleChange}
        className="checkbox"
      />
      <label className="text-sm">
        {label}
        {meta.touched && meta.error && (
          <div className="text-red-500 text-xs">{meta.error}</div>
        )}
      </label>
    </div>
  );
};

CheckboxField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

const ShowIfPreviousLoan = () => {
  const { values } = useFormikContext();
  const { t } = useTranslation("layout");

  if (!values?.has_previous_loan) return null;

  return (
    <>
      <InputField name="previous_loan_name" label={t("Previous_Loan_Name")} placeholder="Enter name" />
      <InputField name="previous_loan_value" label={t("Previous_Loan_Value")} placeholder="Enter value" type="number" />
    </>
  );
};

export const CustomerForm = ({ submitButtonText = "save", isSubmitting, initialValues }) => {
  const { t } = useTranslation("layout");

  return (
    <Form className="space-y-4">

      <div className="grid grid-cols-2 gap-4">
        <InputField name="name" label={t("name")} type="text" value={initialValues?.name} placeholder={t("enter_name")} />
        <InputField name="country_code" label={t("country_code")} type="text" placeholder="+2" />
        <InputField name="phone" label={t("phone")} type="tel" placeholder={t("enter_phone")} />
        <InputField name="email" label={t("email")} type="email" placeholder={t("enter_email")} />
        <InputField name="password" label={t("password")} type="password" placeholder={t("enter_password")} />
        <InputField name="password_confirmation" label={t("password_confirmation")} type="password" placeholder={t("enter_password_confirmation")} />
      </div>

      <InputField name="address" label={t("address")} type="text" />
      <InputField name="nationality" label={t("nationality")} type="text" />
      <InputField name="job" label={t("job")} type="text" />
      <InputField name="salary" label={t("salary")} type="number" />
      <InputField name="work_nature" label={t("work_nature")} type="text" />
      <SelectField name="financing_type" label={t("financing_type")} options={customerTypeOptions} />
      <InputField name="other_income_sources" label={t("other_income_sources")} type="text" />
      <InputField name="national_id" label={t("national_id")} type="text" />
      <CheckboxField name="has_previous_loan" label={t("has_previous_loan")} />
      <ShowIfPreviousLoan />

      <div className="col-span-2 flex justify-end mt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary"
        >
          {t(submitButtonText)}
        </button>
      </div>
    </Form>
  );
};

CustomerForm.propTypes = {
  initialValues: PropTypes.object.isRequired,
  validationSchema: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitButtonText: PropTypes.string,
  isUpdate: PropTypes.bool,
  isSubmitting: PropTypes.bool,
};
