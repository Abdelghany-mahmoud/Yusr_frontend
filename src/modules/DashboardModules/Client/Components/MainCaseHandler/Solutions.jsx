import { useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import SolutionModal from "./SolutionModal";
import { useTranslation } from "react-i18next";
import { Pencil, Trash2 } from "lucide-react";
import { useMutate } from "../../../../../hooks/useMutate";
import { useGetData } from "../../../../../hooks/useGetData";
import { Loading, Spinner } from "../../../../../components/index";

// Table Row Component
const SolutionRow = ({ label, value, highlight }) => (
  <tr>
    <td className="p-2 border border-gray-400 text-gray-700 text-center">
      {label}
    </td>
    <td
      className={`p-2 border border-gray-400 text-center ${
        highlight ? "text-red-600 font-bold" : "font-semibold"
      }`}
    >
      {value ?? "-"}
    </td>
  </tr>
);

SolutionRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  highlight: PropTypes.bool,
};

const FIELD_CONFIG = Object.freeze([
  { key: "real_estate_financing", label: "real_estate_financing" },
  { key: "personal_financing_balance", label: "personal_financing_balance" },
  { key: "other_financing", label: "other_financing" },
  { key: "duration", label: "duration" },
  { key: "annual_rate", label: "annual_rate" },
  { key: "bank_offer", label: "bank_offer" },
  { key: "monthly_installment", label: "monthly_installment", highlight: true },
  { key: "second_installment", label: "second_installment", highlight: true },
  { key: "client_balance", label: "client_balance", highlight: true },
]);

export default function Solutions({ transactionId }) {
  const { t } = useTranslation("layout");

  const fields = useMemo(
    () => FIELD_CONFIG.map((f) => ({ ...f, label: t(f.label) })),
    [t]
  );

  const [isOpen, setIsOpen] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState(null);

  // Fetch solutions
  const { data: solutionsResponse, isLoading: isFetching } = useGetData({
    endpoint: `solutions/${transactionId}`,
    queryKey: ["solutions", transactionId],
  });

  const solutions = useMemo(
    () => solutionsResponse?.data || [],
    [solutionsResponse]
  );

  // Mutations
  const {
    mutate: createSolution,
    isPending: isCreating,
  } = useMutate({
    endpoint: `solutions/${transactionId}`,
    method: "post",
    queryKeysToInvalidate: [["solutions", transactionId]],
  });

  const {
    mutate: updateSolution,
    isPending: isUpdating,
  } = useMutate({
    method: "post",
    endpoint: "solutions/update",
    queryKeysToInvalidate: [["solutions", transactionId]],
  });

  const {
    mutate: deleteSolution,
    isPending: isDeleting,
  } = useMutate({
    method: "delete",
    endpoint: selectedSolution ? `solutions/${selectedSolution.id}` : "",
    queryKeysToInvalidate: [["solutions", transactionId]],
  });

  // Handlers
  const handleEdit = useCallback((solution) => {
    setSelectedSolution(solution);
    setIsOpen(true);
  }, []);

  const handleDelete = useCallback(
    (id) => {
      setSelectedSolution({ id });
      deleteSolution(
        {},
        {
          onSuccess: () => setSelectedSolution(null),
        }
      );
    },
    [deleteSolution]
  );

  const handleSubmit = useCallback(
    (values) => {
      if (selectedSolution) {
        updateSolution(values, {
          onSuccess: () => {
            setSelectedSolution(null);
            setIsOpen(false);
          },
        });
      } else {
        createSolution(values, {
          onSuccess: () => setIsOpen(false),
        });
      }
    },
    [createSolution, updateSolution, selectedSolution]
  );

  return (
    <div className="mt-6 space-y-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-xl">{t("solutions")}</h3>
        <button
          type="button"
          className="bg-green-600 text-white px-3 py-1 rounded flex items-center gap-2"
          onClick={() => setIsOpen(true)}
          disabled={isCreating || isUpdating}
        >
          {(isCreating || isUpdating) && (
            <Spinner />
          )}
          + {t("add_solution")}
        </button>
      </div>

      {isFetching || isCreating || isUpdating ? (
        <Loading height={"100vh"} />
      ) : solutions.length === 0 ? (
        <p className="text-gray-500">{t("no_solutions_added")}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((solution, index) => (
            <div
              key={solution.id}
              className="border border-gray-400 rounded-lg overflow-hidden"
            >
              {/* Header */}
              <div className="bg-red-100 p-2 border-b border-gray-400 flex justify-between items-center">
                <span className="font-bold text-gray-800">
                  {t("solution")} {index + 1}
                </span>
                <span className="font-bold text-gray-800">
                  {t("entity_name")}: {solution.entity_name}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label={t("edit")}
                    className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                    onClick={() => handleEdit(solution)}
                    disabled={isUpdating}
                  >
                    {isUpdating && selectedSolution?.id === solution.id ? (
                      <Spinner/>
                    ) : (
                      <Pencil size={18} />
                    )}
                  </button>
                  <button
                    type="button"
                    aria-label={t("delete")}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50"
                    onClick={() => handleDelete(solution.id)}
                    disabled={isDeleting}
                  >
                    {isDeleting && selectedSolution?.id === solution.id ? (
                      <Spinner/>
                    ) : (
                      <Trash2 size={18} />
                    )}
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
                      value={solution[f.key]}
                      highlight={f.highlight}
                    />
                  ))}
                </tbody>
              </table>

              {/* Transaction duration */}
              <div className="p-1 bg-red-50 border border-red-400 text-center">
                <span>{t("transaction_duration")}: </span>
                <span className="font-bold">{solution.transaction_duration}</span>
              </div>

              {/* Notes */}
              {solution.notes && (
                <div className="p-3 bg-gray-50 border-t border-gray-400">
                  <div className="border-2 border-dashed border-red-500 p-3 rounded text-sm">
                    <span className="font-semibold text-lg">
                      {t("notes")} :{" "}
                    </span>
                    <br />
                    {solution.notes}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <SolutionModal
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          setSelectedSolution(null);
        }}
        onSave={handleSubmit}
        initialValues={selectedSolution || null}
      />
    </div>
  );
}

Solutions.propTypes = {
  transactionId: PropTypes.number.isRequired,
};
