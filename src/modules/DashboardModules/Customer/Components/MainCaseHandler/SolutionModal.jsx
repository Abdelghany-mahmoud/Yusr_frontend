import PropTypes from "prop-types";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { InputField, TextArea } from "../../../../../components";
import { useTranslation } from "react-i18next";


export default function SolutionModal({ open, onClose, onSave, initialValues }) {
  const { t } = useTranslation("layout");
  const SolutionSchema = Yup.object().shape({
    entity_name: Yup.string().required(t("required")),
    real_estate_financing: Yup.number().nullable(),
    personal_financing_balance: Yup.number().nullable(),
    other_financing: Yup.number().nullable(),
    duration: Yup.number().nullable(),
    annual_rate: Yup.number().nullable(),
    bank_offer: Yup.string().nullable(),
    monthly_installment: Yup.number().nullable(),
    second_installment: Yup.number().nullable(),
    client_balance: Yup.number().nullable(),
    transaction_duration: Yup.number().nullable(),
    notes: Yup.string().nullable(),
  });

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto text-black" dir="rtl">
          <DialogTitle className="text-xl font-bold text-gray-800 border-b pb-3 mb-4 flex justify-between items-center">
            {initialValues ? t("edit_solution") : t("add_solution")}
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </DialogTitle>

          <Formik
            initialValues={
              initialValues || {
                entity_name: "",
                real_estate_financing: "",
                personal_financing_balance: "",
                other_financing: "",
                duration: "",
                annual_rate: "",
                bank_offer: "",
                monthly_installment: "",
                second_installment: "",
                client_balance: "",
                transaction_duration: "",
                notes: "",
              }
            }
            validationSchema={SolutionSchema}
            onSubmit={(values) => {
              onSave(values);
              onClose();
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <Form className="space-y-4 w-full">
                <div className="grid grid-cols-4 gap-2 space-x-9">
                  <InputField
                    label={t("entity_name")}
                    name="entity_name"
                    type="text"
                    value={values.entity_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.entity_name && errors.entity_name}
                  />
                  <InputField
                    label={t("real_estate_financing")}
                    name="real_estate_financing"
                    type="number"
                    value={values.real_estate_financing}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.real_estate_financing &&
                      errors.real_estate_financing
                    }
                  />
                  <InputField
                    label={t("personal_financing_balance")}
                    name="personal_financing_balance"
                    type="number"
                    value={values.personal_financing_balance}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.personal_financing_balance &&
                      errors.personal_financing_balance
                    }
                  />
                  <InputField
                    label={t("other_financing")}
                    name="other_financing"
                    type="number"
                    value={values.other_financing}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.other_financing && errors.other_financing}
                  />
                  <InputField
                    label={t("duration")}
                    name="duration"
                    type="number"
                    value={values.duration}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.duration && errors.duration}
                  />
                  <InputField
                    label={t("annual_rate")}
                    name="annual_rate"
                    type="number"
                    value={values.annual_rate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.annual_rate && errors.annual_rate}
                  />
                  <InputField
                    label={t("bank_offer")}
                    name="bank_offer"
                    type="text"
                    value={values.bank_offer}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.bank_offer && errors.bank_offer}
                  />
                  <InputField
                    label={t("monthly_installment")}
                    name="monthly_installment"
                    type="number"
                    value={values.monthly_installment}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.monthly_installment && errors.monthly_installment
                    }
                  />
                  <InputField
                    label={t("second_installment")}
                    name="second_installment"
                    type="number"
                    value={values.second_installment}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.second_installment && errors.second_installment
                    }
                  />
                  <InputField
                    label={t("client_balance")}
                    name="client_balance"
                    type="number"
                    value={values.client_balance}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.client_balance && errors.client_balance}
                  />
                  <InputField
                    label={t("transaction_duration")}
                    name="transaction_duration"
                    type="number"
                    value={values.transaction_duration}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.transaction_duration &&
                      errors.transaction_duration
                    }
                  />
                </div>
                  <TextArea
                    label={t("notes")}
                    name="notes"
                    value={values.notes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.notes && errors.notes}
                  />

                {/* Buttons */}
                <div className="col-span-2 flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 rounded"
                    onClick={onClose}
                  >
                    {t("cancel")}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    {t("save")}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

SolutionModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
};
