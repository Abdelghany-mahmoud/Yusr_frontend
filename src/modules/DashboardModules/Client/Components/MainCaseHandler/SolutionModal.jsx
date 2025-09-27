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

const DEFAULT_VALUES = {
  entity_name: "",
  real_estate_financing: null,
  personal_financing_balance: null,
  other_financing: null,
  duration: null,
  annual_rate: null,
  bank_offer: "",
  monthly_installment: null,
  second_installment: null,
  client_balance: null,
  transaction_duration: null,
  notes: "",
};

const FORM_FIELDS = [
  { name: "entity_name", type: "text", required: true },
  { name: "real_estate_financing", type: "number" },
  { name: "personal_financing_balance", type: "number" },
  { name: "other_financing", type: "number" },
  { name: "duration", type: "number" },
  { name: "annual_rate", type: "number" },
  { name: "bank_offer", type: "text" },
  { name: "monthly_installment", type: "number" },
  { name: "second_installment", type: "number" },
  { name: "client_balance", type: "number" },
  { name: "transaction_duration", type: "number" },
];

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
        <DialogPanel
          className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto text-black"
          dir="rtl"
        >
          <DialogTitle className="text-xl font-bold text-gray-800 border-b pb-3 mb-4 flex justify-between items-center">
            {initialValues ? t("edit_solution") : t("add_solution")}
            <button
              type="button"
              onClick={onClose}
              aria-label={t("close")}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </DialogTitle>

          <Formik
            initialValues={initialValues || DEFAULT_VALUES}
            validationSchema={SolutionSchema}
            onSubmit={(values) => {
              onSave(values);
              onClose();
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <Form className="space-y-4 w-full">
                {/* Dynamic Input Fields */}
                <div className="grid grid-cols-4 gap-2 space-x-9">
                  {FORM_FIELDS.map((f) => (
                    <InputField
                      key={f.name}
                      label={t(f.name)}
                      name={f.name}
                      type={f.type}
                      value={values[f.name]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched[f.name] && errors[f.name]}
                    />
                  ))}
                </div>

                {/* Notes */}
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
