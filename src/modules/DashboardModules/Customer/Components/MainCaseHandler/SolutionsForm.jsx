import { useState } from "react";
import PropTypes from "prop-types";
import SolutionModal from "./SolutionModal";
import { useTranslation } from "react-i18next";
import { Pencil, Trash2 } from "lucide-react";

function SolutionRow({ label, value, highlight }) {
  return (
    <tr>
      <td className="p-2 border border-gray-400 text-gray-700 text-center">{label}</td>
      <td
        className={`p-2 border border-gray-400 text-center ${highlight ? "text-red-600 font-bold" : "font-semibold"
          }`}
      >
        {value ?? "-"}
      </td>
    </tr>
  );
}

export default function SolutionsForm({ solutions, setSolutions }) {
  const { t } = useTranslation("layout");
  const [isOpen, setIsOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleSave = (solution) => {
    if (editingIndex !== null) {
      const updated = [...solutions];
      updated[editingIndex] = solution;
      setSolutions(updated);
    } else {
      setSolutions([...solutions, solution]);
    }
    setEditingIndex(null);
  };

  // Field config
  const fields = [
    { key: "real_estate_financing", label: t("real_estate_financing") },
    { key: "personal_financing_balance", label: t("personal_financing_balance") },
    { key: "other_financing", label: t("other_financing") },
    { key: "duration", label: t("duration") },
    { key: "annual_rate", label: t("annual_rate") },
    { key: "bank_offer", label: t("bank_offer") },
    { key: "monthly_installment", label: t("monthly_installment"), highlight: true },
    { key: "second_installment", label: t("second_installment"), highlight: true },
    { key: "client_balance", label: t("client_balance"), highlight: true },
  ];

  return (
    <div className="mt-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg">{t("solutions")}</h3>
        <button
          type="button"
          className="bg-green-600 text-white px-3 py-1 rounded"
          onClick={() => setIsOpen(true)}
        >
          + {t("add_solution")}
        </button>
      </div>

      {/* Solutions List */}
      {solutions.length === 0 ? (
        <p className="text-gray-500">{t("no_solutions_added")}</p>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {solutions.map((s, index) => (
            <div key={index} className="border border-gray-400 rounded-lg overflow-hidden">
              <div className="bg-red-100 p-2 border-b border-gray-400 flex justify-between items-center">
                <span className="font-bold text-gray-800">{t("solution")} {index + 1}</span>
                <span className="font-bold text-gray-800">{t("entity_name")}: {s.entity_name}</span>
                <div className="flex items-center gap-3">
                  {/* Edit button */}
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      setEditingIndex(index);
                      setIsOpen(true);
                    }}
                  >
                    <Pencil size={18} />
                  </button>

                  {/* Delete button */}
                  <button
                    type="button"
                    className="text-red-600 hover:text-red-800"
                    onClick={() => {
                      const updated = solutions.filter((_, i) => i !== index);
                      setSolutions(updated);
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Table */}
              <table className="w-full text-sm border-collapse">
                <tbody>
                  {fields.map((f) => (
                    <SolutionRow
                      key={f.key}
                      label={f.label}
                      value={s[f.key]}
                      highlight={f.highlight}
                    />
                  ))}
                </tbody>
              </table>

                  <div className="p-1 bg-red-50 border border-red-400 text-center">
                    <span>{t("transaction_duration")}: </span>
                    <span className="font-bold">{s.transaction_duration}</span>
                  </div>
              {/* Footer with transaction duration + notes */}
              <div className="p-3 bg-gray-50 border-t border-gray-400">
                <div className="border-2 border-dashed border-red-500 p-3 rounded text-sm">
                  {s.notes && (
                    <div>
                      <span className="font-semibold text-lg">{t("notes")} : </span>
                      <br />
                      {s.notes}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <SolutionModal
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          setEditingIndex(null);
        }}
        onSave={handleSave}
        initialValues={editingIndex !== null ? solutions[editingIndex] : null}
      />
    </div>
  );
}

const solutionShape = {
  entity_name: PropTypes.string,
  real_estate_financing: PropTypes.string,
  personal_financing_balance: PropTypes.string,
  other_financing: PropTypes.string,
  duration: PropTypes.number,
  annual_rate: PropTypes.string,
  bank_offer: PropTypes.string,
  monthly_installment: PropTypes.string,
  second_installment: PropTypes.string,
  client_balance: PropTypes.string,
  transaction_duration: PropTypes.number,
  notes: PropTypes.string,
};

SolutionsForm.propTypes = {
  solutions: PropTypes.arrayOf(PropTypes.shape(solutionShape)).isRequired,
  setSolutions: PropTypes.func.isRequired,
};

SolutionRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  highlight: PropTypes.bool,
};